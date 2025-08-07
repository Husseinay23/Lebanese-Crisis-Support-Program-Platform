from datetime import timedelta
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView
from .models import ServiceRequest
from .serializers import ServiceRequestSerializer
from rest_framework import viewsets
# Models
from .models import (
    Product, Admin, Cart, ProductRequest, Transaction, User, 
    ServiceRequest, Donation, DonateToOrg, Organization, 
    ServiceOffer, News
)

# Serializers
from .serializers import (
    ProductSerializer, AdminSerializer, CartSerializer, 
    ProductRequestSerializer, TransactionSerializer, UserSerializer, 
    ServiceRequestSerializer, DonationSerializer, DonateToOrgSerializer, 
    OrganizationSerializer, ServiceOfferSerializer, NewsSerializer
)


# User Authentication Views

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name')
    contact = request.data.get('contact')
    location = request.data.get('location')

    if not all([email, password, name]):
        return Response({"detail": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            email=email,
            password=password,
            full_name=name,
            contact_number=contact,
            location=location
        )
        serializer = UserSerializer(user)
        return Response({"detail": "User registered successfully", "user": serializer.data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'detail': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Set the token as a cookie
            response = JsonResponse({
                'refresh': str(refresh),
                'access': access_token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                    'role': user.role,
                }
            })

            # Add the token to a cookie
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                max_age=timedelta(days=1),
                secure=settings.DEBUG == False,
                samesite='Strict'
            )

            return response
        else:
            return Response({'detail': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class CurrentUserView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # Get the access_token from cookies
        access_token = request.COOKIES.get('access_token', None)

        if not access_token:
            return JsonResponse({'detail': 'Access token is missing'}, status=400)

        try:
            # Decode the token to extract the user_id
            decoded_token = jwt.decode(
                access_token,
                settings.SECRET_KEY,
                algorithms=["HS256"]
            )
            user_id = decoded_token.get('user_id', None)

            if not user_id:
                return JsonResponse({'detail': 'User ID not found in token'}, status=400)

            return JsonResponse({'user_id_from_token': user_id})

        except jwt.ExpiredSignatureError:
            return JsonResponse({'detail': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'detail': 'Invalid token'}, status=401)
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)
        
# ViewSets for Modelsclass UserProfileView(APIView):
class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'contact_number': user.contact_number,
            'location': user.location,
            'role': user.role,
            'is_active': user.is_active,
            'is_staff': user.is_staff,
        }
        return Response(user_data)

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer


class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer


class ProductRequestViewSet(viewsets.ModelViewSet):
    queryset = ProductRequest.objects.all()
    serializer_class = ProductRequestSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer

class DonateToOrgViewSet(viewsets.ModelViewSet):
    queryset = DonateToOrg.objects.all()
    serializer_class = DonateToOrgSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer


class ServiceOfferViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = ServiceOffer.objects.all()
    serializer_class = ServiceOfferSerializer


class NewsViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = News.objects.all()
    serializer_class = NewsSerializer




from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import ServiceRequest
from .serializers import ServiceRequestSerializer



class ServiceRequestListView(ListAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [AllowAny]

# View for creating a new service request (POST)
class ServiceRequestCreateView(CreateAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [AllowAny]  # Adjust permissions as necessary

    def perform_create(self, serializer):
        serializer.save()  # The serializer will now handle user_id and other fields
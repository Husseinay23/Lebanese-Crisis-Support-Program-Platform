from rest_framework import serializers
from .models import Admin, Product, Cart, ProductRequest, Transaction, User, ServiceRequest, Donation, DonateToOrg, Organization, ServiceOffer, News

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'admin_name', 'admin_email']

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.URLField(required=False)
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Product
        fields = ['id', 'category', 'name', 'price', 'available_quantity', 'expiration_date', 'image']

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # For read-only product data
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)
    user_id = serializers.IntegerField(write_only=True)  # Accept user ID as an integer

    class Meta:
        model = Cart
        fields = ["id", "user_id", "product", "product_id", "quantity"]  # Include product_id in fields

    def create(self, validated_data):
        # Get the user_id from the validated data
        user_id = validated_data.pop("user_id")
        
        # Check if the user exists
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"user_id": "Invalid user ID."})

        # Get the product instance using product_id
        product_instance = validated_data.pop("product_id")

        # Create the Cart instance with the provided data
        try:
            cart = Cart.objects.create(user=user, product=product_instance, **validated_data)
        except Exception as e:
            # Catch any errors while creating the cart
            raise serializers.ValidationError({"detail": f"Failed to create cart: {str(e)}"})
        
        return cart

class ProductRequestSerializer(serializers.ModelSerializer):
    cart = CartSerializer()  # Nested serializer for cart
    transaction = serializers.PrimaryKeyRelatedField(queryset=Transaction.objects.all(), required=False)  # Optional transaction
    donation = serializers.PrimaryKeyRelatedField(queryset=Donation.objects.all(), required=False)  # Optional donation

    class Meta:
        model = ProductRequest
        fields = ['id', 'cart', 'user_id', 'contact_number', 'location', 'creation_date', 'transaction', 'status', 'donation']

class TransactionSerializer(serializers.ModelSerializer):
    admin = AdminSerializer()  # Nested serializer for admin
    class Meta:
        model = Transaction
        fields = ['id', 'cart_id', 'user_id', 'reference_number', 'transaction_date', 'note', 'amount']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'contact_number', 'password', 'location', 'created_at', 'role']

from .models import ServiceRequest

class ServiceRequestSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)  # Add this field

    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'title', 'description', 'location', 'price',
            'category', 'date', 'contact_number', 'user_id'
        ]

    def create(self, validated_data):
        user_id = validated_data.pop('user_id', None)
        if user_id is None:
            raise serializers.ValidationError({"user_id": "This field is required."})
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"user_id": "Invalid user ID."})
        
        validated_data['user'] = user
        return super().create(validated_data)
class DonationSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for user
    product_request = ProductRequestSerializer()  # Nested serializer for product request
    product = ProductSerializer()  # Nested serializer for product
    class Meta:
        model = Donation
        fields = ['id', 'user', 'product_request', 'product', 'quantity', 'amount']

class DonateToOrgSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for user
    organization = serializers.PrimaryKeyRelatedField(queryset=Organization.objects.all())  # Reference to Organization

    class Meta:
        model = DonateToOrg
        fields = ['id', 'user', 'organization', 'amount', 'message']


class OrganizationSerializer(serializers.ModelSerializer):
    donate_to_org = DonateToOrgSerializer(many=True, source='donatetoorg_set', read_only=True)  # Nested donations
    admin = AdminSerializer()  # Nested serializer for admin

    class Meta:
        model = Organization
        fields = ['id', 'name', 'official_website', 'description', 'image', 'admin', 'donate_to_org']


class ServiceOfferSerializer(serializers.ModelSerializer):
    admin = AdminSerializer()  # Nested serializer for admin
    class Meta:
        model = ServiceOffer
        fields = ['id', 'admin', 'title', 'category', 'description', 'contact_number', 'location', 'creation_date', 'status', 'longitude', 'latitude']

class NewsSerializer(serializers.ModelSerializer):
    admin = AdminSerializer()  # Nested serializer for admin
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = News
        fields = ['id', 'title', 'description', 'author', 'content', 'image', 'url', 'publication_date', 'admin']

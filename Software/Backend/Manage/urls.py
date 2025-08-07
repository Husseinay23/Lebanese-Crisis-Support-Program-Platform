from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'admins', views.AdminViewSet)
router.register(r'carts', views.CartViewSet)
router.register(r'productrequests', views.ProductRequestViewSet)
router.register(r'transactions', views.TransactionViewSet)
router.register(r'users', views.UserViewSet)

router.register(r'donations', views.DonationViewSet)
router.register(r'donatetoorgs', views.DonateToOrgViewSet)
router.register(r'organizations', views.OrganizationViewSet)
router.register(r'serviceoffers', views.ServiceOfferViewSet)
router.register(r'news', views.NewsViewSet)
from .views import register_user,login_user
from .views import CurrentUserView
from .views import UserProfileView
from .views import ServiceRequestListView, ServiceRequestCreateView
# Define URL patterns to include all the viewset routes
urlpatterns = [
    path('api/servicerequests/', ServiceRequestListView.as_view(), name='list-service-requests'),
    path('api/servicerequests/create/', ServiceRequestCreateView.as_view(), name='create-service-request'),
    path('api/', include(router.urls)),
    path('api/auth/register/', register_user, name='register_user'),
    path('api/auth/login/', login_user, name='login_user'),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/current_user/', CurrentUserView.as_view(), name='current_user'),
    path('api/user/', UserProfileView.as_view(), name='user-profile'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

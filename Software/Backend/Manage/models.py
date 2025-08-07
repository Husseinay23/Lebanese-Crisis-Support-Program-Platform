from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from decimal import Decimal

class Admin(models.Model):
    admin_name = models.CharField(max_length=100)
    admin_email = models.EmailField(unique=True)

class Product(models.Model):
    category = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available_quantity = models.PositiveIntegerField()
    expiration_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    def __str__(self):
        return self.name
    









class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    contact_number = models.CharField(max_length=15, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null = True)
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  # Avoid conflicts with the default User model
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Avoid conflicts with the default User model
        blank=True,
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email
    


class ServiceRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=True)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    category = models.CharField(max_length=100, default='Uncategorized')
    date = models.DateField(default=timezone.now, blank=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.title} by {self.user.id}"




class Organization(models.Model):
    name = models.CharField(max_length=100)
    official_website = models.URLField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='organizations/', null=True, blank=True)
    admin = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class DonateToOrg(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE,null=True)  # Added ForeignKey
    amount = models.DecimalField(max_digits=10, decimal_places=2,null=True)
    message = models.TextField(null=True, blank=True)


class ServiceOffer(models.Model):
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    description = models.TextField()
    contact_number = models.CharField(max_length=15, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    longitude = models.DecimalField(max_digits=200, decimal_places=15, null=True, blank=True)
    latitude = models.DecimalField(max_digits=200, decimal_places=15, null=True, blank=True)

class News(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    author = models.CharField(max_length=100)
    content = models.TextField()
    image = models.ImageField(upload_to='news/', null=True, blank=True)
    url = models.URLField(null=True, blank=True)
    publication_date = models.DateField()
    admin = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, blank=True)



class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts',null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    updated_at = models.DateTimeField(auto_now=True,null=True)

    def total_price(self):
        return self.quantity * self.product.price

    def __str__(self):
        return f"Cart ({self.user.email}) - {self.product.name} (x{self.quantity})"

class Transaction(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='transactions',null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions',null=True)
    reference_number = models.CharField(max_length=100, null=True, blank=True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_transactions')

    def __str__(self):
        return f"Transaction ({self.reference_number}) - {self.user.email}"

class ProductRequest(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='requests',null=True)
    user_id = models.IntegerField()
    contact_number = models.CharField(max_length=15, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True,null = True)
    transaction = models.OneToOneField(
        'Transaction', on_delete=models.CASCADE, related_name='product_request',null=True
    )
    status = models.CharField(max_length=50, null=True, blank=True)
    donation = models.OneToOneField(
        'Donation', on_delete=models.SET_NULL, null=True, blank=True, related_name='related_product_request'
    )  # Unique related_name

    def __str__(self):
        return f"ProductRequest (Cart: {self.cart.id}, User: {self.user_id})"
    
class Donation(models.Model):
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations',null=True)
    product_request = models.OneToOneField(
        ProductRequest, on_delete=models.CASCADE, related_name='related_donation'
    )  # Unique related_name
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Donation ({self.donor.email}) - {self.product.name} (x{self.quantity})"
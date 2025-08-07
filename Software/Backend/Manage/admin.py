from django.contrib import admin
from .models import (
    Admin,
    Product,
    Cart,
    ProductRequest,
    Transaction,
    User,
    ServiceRequest,
    Donation,
    DonateToOrg,
    Organization,
    ServiceOffer,
    News,
)


admin.site.register(Admin)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(ProductRequest)
admin.site.register(Transaction)
admin.site.register(User)
admin.site.register(ServiceRequest)
admin.site.register(Donation)
admin.site.register(DonateToOrg)
admin.site.register(Organization)
admin.site.register(ServiceOffer)
admin.site.register(News)

from django.contrib import admin
from .models import Category, Product, InductionCookerSpec, SufuriaSpec

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(InductionCookerSpec)
admin.site.register(SufuriaSpec)

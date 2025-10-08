from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.authtoken import views as authtoken_views
from django.views.generic import TemplateView
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('records.urls')),
    path('api/get-token/', authtoken_views.obtain_auth_token),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]

# In development (DEBUG=True), this adds the necessary URL patterns 
# to serve your static files (CSS, JS) correctly.
if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()

# The catch-all pattern for the frontend MUST be the last one added.
# This ensures that requests for '/admin/' and '/static/' are handled first.
urlpatterns.append(re_path(r'^.*', TemplateView.as_view(template_name='index.html'), name='home'))


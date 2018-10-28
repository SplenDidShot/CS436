from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('friend', views.get_friends),
    path('post', views.get_posts),
    path('make_post', views.make_post),
    path('follow', views.follow),
    path('register', views.register),
    path('login', views.frinet_login),
    path('logout', views.frinet_logout),
]

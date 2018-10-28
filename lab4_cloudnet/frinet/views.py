from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import render_to_response
from django.db.utils import IntegrityError

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import logout, login, authenticate
from .models import *
from .serializers import UserSerializer, PostSerializer

from django.core.cache import cache

def index(request):
    return render_to_response('index.html')


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_friends(request):
    user = request._request.user
    friends = user.friends
    friends_ser = UserSerializer(friends, many=True)
    return JsonResponse(friends_ser.data, safe=False)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_posts(request):
    user = request._request.user

    # TODO: Your caching logic here

    
    all_users = list(user.friends.all())
    all_users.append(user)

    all_posts = []
    for u in all_users:
        if cache.get(u) == None :
            temp = [];
            temp += [p for p in Post.objects.filter(user=u)]
            cache.set(u, temp, 30)
            print("cache set", u)
            all_posts += [p for p in Post.objects.filter(user=u)]
        else: 
            all_posts += cache.get(u)
            print("cache used", u)

       # all_posts += [p for p in Post.objects.filter(user=u)]

    # sort all the post by timeline
    all_posts = sorted(all_posts, key=lambda x: x.date, reverse=True)

    # limit the post number to 25 and serialize the post
    post_ser = [PostSerializer(p).data for p in all_posts[:25]]
    
    return JsonResponse(post_ser, safe=False)


@api_view(['POST'])
@parser_classes((JSONParser,))
@permission_classes((IsAuthenticated,))
def make_post(request):
    content = request.data.get('content')
    user = request._request.user
    post = Post(user=user, content=content)
    post.save()
    return JsonResponse({'post_id': post.id})


@api_view(['POST'])
@parser_classes((JSONParser,))
@permission_classes((IsAuthenticated,))
def follow(request):
    friend_name = request.data.get('friend_name')
    u = request._request.user
    f = User.objects.filter(username=friend_name)
    if len(f) == 0:
        return Response(status=status.HTTP_404_NOT_FOUND)
    f = f[0]
    if not f in u.friends.all():
        new_friends = Following(follower=u, followee=f)
        new_friends.save()
        return JsonResponse({'relationship_id': new_friends.id})
    else:
        following_id = User.friends.through.objects.filter(follower=u, followee=f)[0].id
        return JsonResponse({'relationship_id': following_id})


@api_view(['POST'])
@parser_classes((JSONParser,))
def register(request):
    uname = request.data.get('username')
    passwd = request.data.get('password')

    try:
        u = User(username=uname, password=passwd)
        u.set_password(passwd)
        u.save()
        return Response(status=status.HTTP_201_CREATED)

    # user already exist in database
    except IntegrityError:
        return Response(status=status.HTTP_409_CONFLICT)


@api_view(['POST'])
@parser_classes((JSONParser,))
def frinet_login(request):
    uname = request.data.get('username')
    passwd = request.data.get('password')
    user = authenticate(username=uname, password=passwd)
    if user:
        login(request._request, user)

    else:
        return Response({"token": ""}, status=status.HTTP_403_FORBIDDEN)

    # generate token for client
    token, _ = Token.objects.get_or_create(user=user)
    r = Response()
    r.set_cookie(key="token", value=token.key)
    return r


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def frinet_logout(request):
    print ("before logout")
    logout(request._request)
    print ("after logout")
    request.user.auth_token.delete()
    r = Response()
    r.delete_cookie('token')
    r.status_code = status.HTTP_200_OK
    return r


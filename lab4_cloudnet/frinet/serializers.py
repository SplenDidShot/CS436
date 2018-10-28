from rest_framework import serializers
from frinet.models import User, Post

class UserSerializer(serializers.ModelSerializer):
    friends = serializers.StringRelatedField(many=True)
    class Meta:
        model = User
        fields = ('username', 'friends')
        
class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Post
        fields = ('user', 'date', 'content')

        

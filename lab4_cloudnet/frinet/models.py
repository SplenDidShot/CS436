from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    #    netid = models.CharField(max_length = 10)
    friends = models.ManyToManyField("self", through="Following", symmetrical=False)

    
    def __str__(self):
        return self.username

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return self.content

class Following(models.Model):
    follower = models.ForeignKey(User, related_name="follower", on_delete=models.CASCADE)
    followee = models.ForeignKey(User, related_name="followee", on_delete=models.CASCADE)

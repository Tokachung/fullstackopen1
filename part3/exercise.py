'''

Given a stream of content ids, and a stream of associated action performed on them.

A content id, is an id that links to a "Content" like a video or an image or some kind of post.

Example of content are video, pages, post, two actions associated with a content ID. 

{

}

mostPopular()
increasePopularity(content_id)
decreasePopularity(content_id)

{content: {
    like,
    like,
    comment,
    dislike,
    spam
}}

'''

class Popularity:
    def __init__(self):
        self.content = {}

    def mostPopular(self):
        mostPopularContent = None
        mostPopularContentId = None
        print(self.content.items())

        for contentId, contentValue in self.content.items():
            if contentValue > mostPopularContent:
                mostPopularContentId = contentId
                mostPopularContent = contentValue
        
        print(mostPopularContentId)
        return mostPopularContentId
    
    def increasePopularity(self, content_id):
        if content_id not in self.content:
            self.content[content_id] = 0

        self.content[content_id] += 1
    
    def decreasePopularity(self, content_id):
        if content_id not in self.content and self.content[content_id] != 0:
            self.content[content_id] = 0

        else:
            self.content[content_id] -= 1


popularity = Popularity()
popularity.increasePopularity(1)
popularity.increasePopularity(2)
popularity.increasePopularity(2)
popularity.decreasePopularity(2)
popularity.decreasePopularity(2)
popularity.mostPopular()


'''
Consider edge cases e.g. two of the same
DO verification before I get into the logic e.g. does something exist in the dict
Simplify the  question I've been provided into fundamental features, don't focus on smaller details
More familiarity with python constructors, dictionary operations.
Be more precise with words and variable names. 
'''
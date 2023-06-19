"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, owned) {

  const hostName = story.getHostName();
  let str;
  if(owned){
    str = `<li id="${story.storyId}">
            <span class="favorite">☆</span>
            <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
            <span class="delete">Delete Story</span>
          </li>`
  }
  else{
    str = `<li id="${story.storyId}">
            <span class="favorite">☆</span>
            <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </li>`
  }
  return $(str);
}

function generateFavoriteStoryMarkup(story, owned) {

  const hostName = story.getHostName();
  let str;
  if(owned){
    str = `<li id="${story.storyId}">
            <span class="favorite">★</span>
            <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
            <span class="delete">Delete Story</span>
          </li>`
  }
  else{
    str = `<li id="${story.storyId}">
            <span class="favorite">★</span>
            <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </li>`
  }
  return $(str);
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  $allStoriesList.empty();
  
  if(currentUser){
    //display favorited stories first
    for(const story of currentUser.favorites){
        if(currentUser.ownStories.some(ownStory => ownStory.storyId === story.storyId)){
          const $story = generateFavoriteStoryMarkup(story, true);
          $allStoriesList.append($story);
        }
        else{
          const $story = generateFavoriteStoryMarkup(story, false);
          $allStoriesList.append($story);
        }
    }
    //display non favorite stories
    for(const story of storyList.stories){
      //filter out favorites
      if(!(currentUser.favorites.some(favStory => favStory.storyId === story.storyId))){
        //add delete button to stories written by user
        if(currentUser.ownStories.some(ownStory => ownStory.storyId === story.storyId)){
          const $story = generateStoryMarkup(story, true);
          $allStoriesList.append($story);
        }
        //display remaining stories
        else{
          const $story = generateStoryMarkup(story, false);
          $allStoriesList.append($story);
        }
      }
    }
  }
  else{
    // loop through all of our stories and generate HTML for them
    for (let story of storyList.stories) {
        const $story = generateStoryMarkup(story, false);
        $allStoriesList.append($story);
      }
    }
  
  $(".favorite").on("click", toggleFavoriteStory)
  $(".delete").on("click", deleteStory)
  $allStoriesList.show();
}

async function submitStory(){
  const author = $("#authorInput")[0].value;
  const title = $("#titleInput")[0].value
  const url = $("#urlInput")[0].value
  storyList.addStory(currentUser, {author, title, url})
}

$("#submitStoryBtn").on("click", submitStory)

async function toggleFavoriteStory(e){
  const storyId = e.currentTarget.parentElement.id
  currentUser.toggleFavorite(storyId);
}
async function deleteStory(e){
  const storyId = e.currentTarget.parentElement.id;
  currentUser.deleteStory(storyId)
}


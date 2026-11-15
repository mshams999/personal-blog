/** Maps a Storyblok story into the personal review shown on a book page. */
export function mapBookReview(story) {
    if (!story) return null
    const content = story.content || {}
    return {
        id: story.id,
        body: content.review || content.body || null,
    }
}

export function bookReviewSlug(bookSlug) {
    return `library/${bookSlug}`
}

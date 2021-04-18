let quoteList = document.querySelector("#quote-list")
let quoteForm = document.querySelector("#new-quote-form")

document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/quotes?_embed=likes")
        .then(res => res.json())
        .then(function(quoteArray){
            quoteArray.forEach(function(quoteObj){
                appendQuote(quoteObj)
            })
        })
})

function appendQuote(quoteObj){
    let newQuoteLi = document.createElement("li")
        newQuoteLi.classList.add("quote-card")
        newQuoteLi.innerText

    let newQuoteBlock = document.createElement("blockquote")
        newQuoteBlock.classList.add("blockquote")

    let quoteP = document.createElement("p")
        quoteP.classList.add("mb-0")
        quoteP.innerText = quoteObj.quote

    let quoteFooter = document.createElement("footer")
        quoteFooter.classList.add("blockquote-footer")
        quoteFooter.innerText = quoteObj.author

    let likeButton = document.createElement("button")
        likeButton.classList.add("btn-success")
        likeButton.innerText = "Likes: "

    let numLikes = document.createElement("span")
        numLikes.innerText = quoteObj.likes.length

    let deleteButton = document.createElement("button")
        deleteButton.classList.add("btn-danger")
        deleteButton.innerText = "Delete"

        likeButton.append(numLikes)
            
        newQuoteBlock.append(quoteP, quoteFooter, likeButton, deleteButton)
    
        newQuoteLi.append(newQuoteBlock)
    
        quoteList.append(newQuoteLi)
        
        deleteButton.addEventListener("click", function(){
            fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
                method: "DELETE"
        })
            .then(res => res.json())
            .then(function(emptyObj){
                newQuoteLi.remove()
            })
    })

    likeButton.addEventListener("click", function(){
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {
                quoteId: quoteObj.id
            })
        })
            .then(res => res.json())
            .then(function(newLikeObj){
                numLikes.innerText = parseInt(numLikes.innerText, 10) + 1

                let quoteLikeArray = [...quoteObj.likes, newLikeObj]
                quoteObj.likes = quoteLikeArray
            })
    })
}

quoteForm.addEventListener("submit", function(event){
    event.preventDefault()
    let userInputQuote = event.target["new-quote"].value
    let userInputAuthor = event.target.author.value

    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quote: userInputQuote,
            author: userInputAuthor
        })
    })
        .then(res => res.json())
        .then(function(newlyCreatedQuote){
            newlyCreatedQuote.likes = []
            console.log(newlyCreatedQuote)
            appendQuote(newlyCreatedQuote)
        })
})
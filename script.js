function copyReferralLink() {
            const referralLink = "https://work-sniper.com";
            navigator.clipboard.writeText(referralLink).then(function() {
                alert("Copied");
            }, function(err) {
                console.error('Failed to copy: ', err);
            });
        }

        document.getElementById("time-range").addEventListener("input", function() {
            var time = this.value;
            document.getElementById("time-label").textContent = time + " minutes (How much time do you have?)";
        });
        
 
        function translateText(textToTranslate) {
            var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(textToTranslate) + '&langpair=ar|en';

            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    return data.responseData.translatedText;
                })
                .catch(error => {
                    console.error('Error:', error);
                    return null;
                });
        }

        function translateRecipeToEnglish(recipe) {
            var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(recipe) + '&langpair=ar|en';

            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    return data.responseData.translatedText;
                })
                .catch(error => {
                    console.error('Error:', error);
                    return null;
                });
        }

        document.getElementById("recipe-button").addEventListener("click", function() {
            const time = document.getElementById("time-range").value;
            const ingredientsInput = document.getElementById("ingredients-input");
            const ingredients = ingredientsInput.value;

            // Translate ingredients to English
            translateText(ingredients)
                .then(translatedIngredients => {
                    if (translatedIngredients) {
                        const defaultPreparationTime = time; // Set default preparation time
                        const appId = "9fa74179";
                        const appKey = "d1d5b7e7a12b05cbda6767a1fb30a3b9";
                        const url = `https://api.edamam.com/search?q=${translatedIngredients}&app_id=${appId}&app_key=${appKey}&time=${time}`;

                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                const recipeList = document.getElementById("recipe-list");
                                recipeList.innerHTML = "";

                                data.hits.forEach(hit => {
                                    const recipe = hit.recipe;

                                    // Translate recipe to English
                                    translateRecipeToEnglish(recipe.label)
                                        .then(translatedRecipe => {
                                            const recipeItem = document.createElement("div");
                                            recipeItem.classList.add("recipe-container");
                                            recipeItem.innerHTML = `
                                                <h2>${translatedRecipe}</h2>
                                                <img class="recipe-image" src="${recipe.image}" alt="${translatedRecipe}">
                                                <div>
                                                    <p><strong>Preparation Time:</strong> ${defaultPreparationTime} minutes</p>
                                                    <p><strong>Ingredients:</strong></p>
                                                    <ul>
                                                        ${recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
                                                    </ul>
                                                    <p><strong>Instructions:</strong></p>
                                                    ${recipe.instructions ? `<ol>${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}</ol>` : `<p><a href="${recipe.url}" target="_blank">Click here to see instructions</a></p>`}
                                                </div>
                                            `;
                                            recipeList.appendChild(recipeItem);
                                        });
                                });
                            });
                    } else {
                        console.error('Failed to translate ingredients');
                    }
                });
        });
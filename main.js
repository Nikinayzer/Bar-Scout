(() => {
    console.log("test products: 8715700421360,8593807234713,5900020018403"); 
    const date = new Date();
    const currentDate = date.toISOString().split('T')[0]; // ISO format: YYYY-MM-DD
    const appContainer = $("#app");
    const header = $("header");

    const searchBarDiv = $('<div id="searchBarDiv"></div>');
    const barInput = $('<input placeholder="&#x1F50E;&#xFE0E; Search by barcode" type="text"/>');
    const sortAndDateDiv = $('<div id="sortAndDateDiv"></div>');
    const sortButton = $('<label for="sortButton">Sort:</label><button id="sortButton">&udarr;</button>');
    const dateInput = $(`<label for="date">filter by date:</label><input type="date" name="date" id="dateInput" max="${currentDate}">`);

    const productsDiv = $('<div class="productsDiv"></div>');
    const productDivTitle = $("<h2 id='productsDivTitle'>My products</h2>");
    const noProductsGuide = $("<p id='noProductsGuide'>Hmm... You still haven't searched for any product! Let's fix that. Enter any barcode in search above! <br><br> 8715700421360, for example.</p>");
    const searchDiv = $('<div class="searchDiv"></div>');

    const footer = $('<footer><p>Bar Scout | Made with love by <a href="https://github.com/Nikinayzer">Nikita Korotov</a></p></footer>');

    searchBarDiv.append(barInput);
    sortAndDateDiv.append(sortButton).append(dateInput);
    searchDiv.append(searchBarDiv).append(sortAndDateDiv);

    appContainer.append(searchDiv).append(productsDiv);
    productsDiv.append(productDivTitle);
    appContainer.append(footer);

    function retrieveItemsFromLocalStorage() {
        let nutrRatingArr = [];
        productsDiv.empty().append(productDivTitle);

        const entries = JSON.parse(localStorage.getItem("entries"));

        if (!entries || entries.entries.length === 0) {
            const noProductsGuideText = entries ? 
                "<p id='noProductsGuide'>Looks like you deleted all of your products... Wanna add some more?</p>" :
                noProductsGuide;
            productsDiv.append(noProductsGuideText);
            $("#nutrRatingAvg").remove();
            return;
        }

        entries.entries.forEach(entry => {
            const dateOfEntryDiv = $(`<div class="dateOfEntryDiv" id="${entry.date}"><h2 class="dateOfEntry">${entry.date}</h2></div>`);
            productsDiv.append(dateOfEntryDiv);
            createProductCards(entry, nutrRatingArr);
        });

        const avgRating = translateScoreToGrade(calcAvgOfArr(lettersToDigits(nutrRatingArr)));
        $("#nutrRatingAvg").remove();
        const nutritionRatingAvgDisplay = $(`<h2 id='nutrRatingAvg'>Your average nutrition rating: ${avgRating}</h2>`);
        header.append(nutritionRatingAvgDisplay);
    }

    function lettersToDigits(arr) {
        const gradeMap = { 'a': 5, 'b': 4, 'c': 3, 'd': 2, 'e': 1 };
        return arr.map(letter => gradeMap[letter] || 0);
    }

    function calcAvgOfArr(arr) {
        return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    }

    function translateScoreToGrade(score) {
        if (score < 2) return "E";
        if (score < 2.3) return "D";
        if (score < 2.5) return "D+";
        if (score < 3) return "C-";
        if (score < 3.3) return "C";
        if (score < 3.5) return "C+";
        if (score < 4) return "B-";
        if (score < 4.3) return "B";
        if (score < 4.5) return "A-";
        return "A";
    }

    function createProductCards(entry, nutrRatingArr) {
        entry.products.forEach((product, index) => {
            nutrRatingArr.push(product.nutriscore_grade);
            const productCard = $(`
                <div class="productCard" id="${entry.date}_${index}">
                    <img class="productCardPicture" src="${product.image_small_url || "./noPhotoImg.png"}" alt="${product.product_name} photo">
                    <div class="productCardInfo">
                        <h3 class="productCardTitle">${product.product_name || "no info"}</h3>
                        <ul class="productCardStats">
                            <li>Quantity: ${product.quantity || "no info"}</li>
                            <li>Energy: ${product.nutriments.energy || "no info"} ${product.nutriments.energy_unit || ""}</li>
                            <li>Carbohydrates: ${product.nutriments.carbohydrates || "no info"} ${product.nutriments.carbohydrates_unit || ""}</li>
                            <li>Fats: ${product.nutriments.fat || "no info"} ${product.nutriments.fat_unit || ""}</li>
                            <li>Protein: ${product.nutriments.proteins || "no info"} ${product.nutriments.proteins_unit || ""}</li>
                            <li>Sugars: ${product.nutriments.sugars || "no info"} ${product.nutriments.sugars_unit || ""}</li>
                        </ul>
                    </div>
                    <h2 class="productCardRating">${product.nutriscore_grade || "?"}</h2>
                    <button class="deleteButton" id="${entry.date}_${index}_button">X</button>
                </div>
            `);
            $(`#${entry.date}`).append(productCard);
        });
    }

    function loadSpinner() {
        const loadSpinner = $(`<div class="loadSpinnerContainer">
            <div class="loadSpinnerBackground"></div>
            <div class="loadSpinner"></div>
        </div>`);
        appContainer.append(loadSpinner);
    }

    function removeSpinner() {
        $(".loadSpinnerContainer").remove();
    }

    function findIndexOfDate(list, date) {
        return list.entries.findIndex(element => element.date === date);
    }

    $(document).ready(function () {
        retrieveItemsFromLocalStorage();

        $(document).on("click", ".deleteButton", function (event) {
            event.preventDefault();

            const list = JSON.parse(localStorage.getItem("entries"));
            const id = $(this).closest(".productCard").attr("id");
            const [deleteDate, deletePosition] = id.split("_");

            const entryIndex = findIndexOfDate(list, deleteDate);
            list.entries[entryIndex].products.splice(deletePosition, 1);

            if (!list.entries[entryIndex].products.length) {
                list.entries.splice(entryIndex, 1);
            }

            localStorage.setItem("entries", JSON.stringify(list));
            retrieveItemsFromLocalStorage();
        });

        $(document).on("click", "#sortButton", function (event) {
            event.preventDefault();

            const toSort = $(".productsDiv").children().not("#productsDivTitle").get();
            toSort.sort((a, b) => +a.id.split("_")[1] - +b.id.split("_")[1]);
            $(".productsDiv").append(toSort);
        });

        $("#dateInput").change(function () {
            const date = $(this).val();
            $(".dateOfEntryDiv").toggle(date ? `#${date}` : true);

            if (!$(".productsDiv > div:visible").length) {
                $(".productsDiv").append('<h2 id="noProductsToDisplay">No products to display!</h2>');
            } else {
                $("#noProductsToDisplay").remove();
            }
        });

        barInput.on("keypress", function (e) {
            if (e.which === 13) {
                e.preventDefault();

                const barcode = $(this).val();
                if (!/^[0-9]{8,14}(,[0-9]{8,14})*$/.test(barcode)) {
                    $(this).addClass("error").attr("placeholder", "Provide a valid barcode!").val('');
                    return;
                }

                loadSpinner();

                if (!localStorage.getItem("entries")) {
                    localStorage.setItem("entries", JSON.stringify({ entries: [] }));
                }

                const url = `https://world.openfoodfacts.org/api/v2/search?code=${barcode}&fields=code,product_name,generic_name,quantity,image_small_url,nutriments,nutriments_data,nutriscore_grade`;

                axios.get(url)
                    .then(resp => {
                        if (!resp.data.products.length) {
                            barInput.addClass("error").attr("placeholder", "Didn't find a product!").val('');
                            removeSpinner();
                            return;
                        }

                        const list = JSON.parse(localStorage.getItem("entries"));
                        const productsJSON = resp.data.products;

                        if (findIndexOfDate(list, currentDate) === -1) {
                            list.entries.push({ date: currentDate, products: [] });
                        }

                        list.entries[findIndexOfDate(list, currentDate)].products.push(...productsJSON);
                        localStorage.setItem("entries", JSON.stringify(list));
                        retrieveItemsFromLocalStorage();
                        removeSpinner();
                    })
                    .catch(err => console.error(err));
            }
        });
    });
})();

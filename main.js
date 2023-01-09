(() => {
    const date = new Date();
    let day = ("0" + (date.getDate() + 2)).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);

    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;

    let nutrRatingAvg;
    $(document).ready(function () {


        const lettersToDigits = (arr) => {
            let lettersToDigitsArr = [];
            arr.forEach((letter) => {
                switch (letter) {
                    case "a":
                        lettersToDigitsArr.push(5);
                        break;
                    case "b":
                        lettersToDigitsArr.push(4);
                        break;
                    case "c":
                        lettersToDigitsArr.push(3);
                        break;
                    case "d":
                        lettersToDigitsArr.push(2);
                        break;
                }
            });
            return lettersToDigitsArr;
        };

        const calcAvgOfArr = (arr) => {
            const sum = arr.reduce((a, b) => a + b, 0);
            const avg = sum / arr.length || 0;
            return avg;
        };
        const translateScoreToGrade = (score) => {
            let grade;
            if (score < 2.3) grade = "D";
            if (score >= 2.3 && score < 2.5) grade = "D+";
            if (score >= 2.5 && score < 3) grade = "C-";
            if (score >= 3 && score < 3.3) grade = "C";
            if (score >= 3.3 && score < 3.5) grade = "C+";
            if (score >= 3.5 && score < 4) grade = "B-";
            if (score >= 4 && score < 4.3) grade = "B";
            if (score >= 4.3 && score < 4.5) grade = "A-";
            if (score >= 4.5) grade = "A";
            return grade;
        };

        console.log("Init " + currentDate);

        console.log("test products: 8715700421360,8593807234713,5900020018403");
        const appContainer = $("#app");

        const searchBarDiv = $('<div id="searchBarDiv"></div>');
        const barInput = $(
            '<input placeholder="&#x1F50E;&#xFE0E; Search by barcode" type="text"/>'
        );
        //const getProductsButton = $("<button>Get product!</button>");

        const sortAndDateDiv = $('<div id="sortAndDateDiv"></div>');
        const sortButton = $("<button id='sortButton'>&udarr; Sort</button>");
        const dateInput = $(`<input type="date" name="date" id="dateInput" max="${currentDate}">`);

        const productsDiv = $('<div class="productsDiv"></div>');
        const productDivTitle = $("<h2>My products</h2>");
        const searchDiv = $('<div class="searchDiv"></div>');

        //load loader

        const loadSpinner = () => {
            const loadSpinnerContainer = $('<div class="loadSpinnerContainer"></div>');
            const loadSpinnerBackground = $('<div class="loadSpinnerBackground"></div>');
            const loadSpinner = $('<div class="loadSpinner"></div>');
            loadSpinnerContainer.append(loadSpinnerBackground);
            loadSpinnerContainer.append(loadSpinner);
            appContainer.append(loadSpinnerContainer);
            //$('body').append(loadSpinnerContainer);
        };

        const removeSpinner = () => {
            $(".loadSpinnerContainer").remove();
        }

        const header = $("header");

        searchBarDiv.append(barInput);
        //searchBarDiv.append(getProductsButton);
        searchDiv.append(searchBarDiv);

        sortAndDateDiv.append(sortButton);
        sortAndDateDiv.append(dateInput);
        searchDiv.append(sortAndDateDiv);

        appContainer.append(searchDiv);
        appContainer.append(productsDiv);
        productsDiv.append(productDivTitle);

        //localStorage setup and getting saved info
        if (!localStorage.getItem("entries")) {
            let jsonList = {
                entries: [],
            };
            jsonList.entries.push({ date: currentDate, products: [] });
            localStorage.setItem("entries", JSON.stringify(jsonList));
            //retrieveItemsFromLocalStorage();
        } else {
            retrieveItemsFromLocalStorage();
        }

        function retrieveItemsFromLocalStorage() {
            let nutrRatingArr = [];

            productsDiv.empty();
            JSON.parse(localStorage.getItem("entries")).entries.forEach((entry) => {
                const dateOfEntryDiv = $(
                    `<div class="dateOfEntryDiv" id="${entry.date}"></div>`
                );
                const dateOfEntry = $(`<h2 class="dateOfEntry">${entry.date}</h2>`);
                dateOfEntryDiv.append(dateOfEntry);
                productsDiv.append(dateOfEntryDiv);
                createProductCards(entry, nutrRatingArr);
            });
            nutrRatingAvg = translateScoreToGrade(
                calcAvgOfArr(lettersToDigits(nutrRatingArr))
            );
            $("#nutrRatingAvg").remove();
            const nutritionRatingAvgDisplay = $(
                `<h2 id='nutrRatingAvg'>Your average nutrition rating: ${nutrRatingAvg}</h2>`
            );
            header.append(nutritionRatingAvgDisplay);
        }

        function createProductCards(entry, nutrRatingArr) {
            entry.products.forEach((product, index) => {
                nutrRatingArr.push(product.nutriscore_grade);
                const productCard = $(
                    `<div class="productCard" id="${entry.date}_${index}"></div>`
                );
                const productCardPicture = $(
                    `<img class="productCardPicture" src="${product.image_small_url}" alt="${product.product_name}+ photo"></img>`
                );
                const productCardInfo = $(`<div class="productCardInfo"></div`);
                const productCardTitle = $(
                    `<h3 class="productCardTitle">${product.product_name}</h3>`
                );
                const productCardStats = $('<ul class="productCardStats"></ul>');
                const productCardQuanity = $(`<li>Quantity: ${product.quantity}</li>`);
                const productCardEnergy = $(
                    `<li>Energy: ${product.nutriments.energy} kJ</li>`
                );
                const productCardCarbonhydrates = $(
                    `<li>Carbonhydrates: ${product.nutriments.carbohydrates} ${product.nutriments.carbohydrates_unit}</li>`
                );
                const productCardFat = $(
                    `<li>Fats: ${product.nutriments.fat} ${product.nutriments.fat_unit}</li>`
                );
                //const productCardFiber = $(`<li>${product.nutriments.fiber}</li>`);
                const productCardProteins = $(
                    `<li>Protein: ${product.nutriments.proteins} ${product.nutriments.proteins_unit}</li>`
                );
                const productCardSugars = $(
                    `<li>Sugars: ${product.nutriments.sugars} ${product.nutriments.sugars_unit}</li>`
                );
                const productCardRating = $(
                    `<h2 class="productCardRating">${product.nutriscore_grade}</h2>`
                );

                //delete button
                const productCardDeleteButton = $(
                    `<button class="deleteButton" id="${entry.date}_${index}_button">X</button>`
                );

                productCard.append(productCardPicture);
                productCard.append(productCardInfo);
                productCardInfo.append(productCardTitle);
                productCardInfo.append(productCardStats);
                productCardStats.append(productCardQuanity);
                productCardStats.append(productCardEnergy);
                productCardStats.append(productCardCarbonhydrates);
                productCardStats.append(productCardFat);
                //productCardStats.append(productCardFiber);
                productCardStats.append(productCardProteins);
                productCardStats.append(productCardSugars);
                productCard.append(productCardRating);

                productCard.append(productCardDeleteButton);

                const dateOfEntryDiv = $(`#${entry.date}`);
                //productsDiv.append(productCard);
                dateOfEntryDiv.append(productCard);
            });
        }

        /*
                                            // $(document) is because of event delegation ('.productCard' is being overwritten).
                                            */
        $(document).on("click", ".deleteButton", function (event) {
            event.preventDefault();

            let list = JSON.parse(localStorage.getItem("entries"));

            const id = $(this).closest("div").attr("id");
            const deleteIDIndexArr = id.split("_");
            const deleteDate = deleteIDIndexArr[0];
            const deletePosition = deleteIDIndexArr[1];

            console.log("index of deleting item " + deletePosition);
            console.log("date of deleting item " + deleteDate);
            //console.log(list);

            function findIndexOfDeletingDate(list) {
                const index = list.entries.findIndex(
                    (element) => element.date === deleteDate
                );
                return index;
            }

            const entryIndex = findIndexOfDeletingDate(list);
            //console.log(entryIndex);

            //console.log(list.entries[entryIndex].products[deletePosition]);
            list.entries[entryIndex].products.splice(deletePosition, 1);
            console.log(list.entries[entryIndex].products.length);
            if (list.entries[entryIndex].products.length == 0) {
                console.log(list.entries[entryIndex]);
                list.entries.splice(entryIndex, 1);
            }

            localStorage.setItem("entries", JSON.stringify(list));

            retrieveItemsFromLocalStorage();
        });

        /* Sorting alg*/
        $(document).on("click", "#sortButton", function (event) {
            event.preventDefault();

            let toSort = $(".productsDiv").children();
            toSort = Array.prototype.slice.call(toSort, 0);

            toSort.sort(function (a, b) {
                let aord = +a.id.split("-")[1];
                let bord = +b.id.split("-")[1];
                return aord > bord ? 1 : -1;
            });

            let parentProductDiv = $(".productsDiv");
            toSort.forEach((div, i) => {
                parentProductDiv.append(toSort[i]);
            });
        });

        /* Display products by date */
        $("#dateInput").change(function () {
            $("#noProductsToDisplay").remove();

            let date = $("#dateInput").val();

            if (date == "") {
                $(".dateOfEntryDiv").show();
            } else {
                $(".dateOfEntryDiv").show(); // to update already hidden cards by this func.
                $(".dateOfEntryDiv").not(`#${date}`).hide();
            }

            if (
                $("div.productsDiv>div").length ==
                $('div.productsDiv>div[style*="display: none;"]').length
            ) {
                const noProductsToDisplay = $(
                    '<h2 id="noProductsToDisplay">No products to display!</h2>'
                );
                $(".productsDiv").append(noProductsToDisplay);
            }
        });

        function findIndexOfDate(list) {
            const index = list.entries.findIndex(
                (element) => element.date === currentDate
            );
            return index;
        }

        //ON CLICK

        barInput.on("keypress", function (e) {
            if (e.which == 13) {
                e.preventDefault();
                const inputRegexCheck = new RegExp("^[0-9]{8,14}(,[0-9]{8,14})*$");
                if (!inputRegexCheck.test(barInput.val())) {
                    barInput.addClass("error");
                    barInput.attr("placeholder", "Provide a valid barcode!");
                    barInput.val('');
                } else {
                    loadSpinner();
                    const url = `https://world.openfoodfacts.org/api/v2/search?code=${barInput.val()}&fields=code,product_name,generic_name,quantity,image_small_url,nutriments,nutriments_data,nutriscore_grade`;
                    barInput.removeClass("error");
                    barInput.val('');
                    barInput.attr("placeholder", "🔎︎ Search by barcode");

                    let list = JSON.parse(localStorage.getItem("entries"));
                    axios
                        .get(url)
                        .then((resp) => {
                            if (resp.data.products.length == 0) {
                                barInput.addClass("error");
                                barInput.attr("placeholder", "Didn't find a product!");
                                barInput.val('');
                                removeSpinner();
                                return;
                            }
                            resp.data.products.forEach((product) => {
                                resp.data.products.slice(product, 1);
                            });
                            console.log(resp.data);
                            const productsJSON = [];
                            console.log("productsJSON");
                            console.log(productsJSON);
                            resp.data.products.forEach((product) => {
                                const productJSON = product;
                                productsJSON.push(productJSON);
                            });

                            if (findIndexOfDate(list) === -1) {
                                console.log("JSON needs a new day");
                                list.entries.push({ date: currentDate, products: [] });
                            }
                            productsJSON.forEach((product) => {
                                list.entries[findIndexOfDate(list)].products.push(product);
                            });
                            localStorage.setItem("entries", JSON.stringify(list));
                            retrieveItemsFromLocalStorage();

                            setTimeout(removeSpinner, 1000)
                        })
                        .catch((err) => console.log(err));
                }
            }
        });
    });
})();
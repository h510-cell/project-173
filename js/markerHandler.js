var userId = null

AFRAME.registerComponent("MarkerHandler", {
init: async function() {

    if (userId === null) {
        this.askUserId();
      }
  
      
  
      //makerFound Event
      this.el.addEventListener("markerFound", () => {
        if (userId !== null) {
          var markerId = this.el.id;
          this.handleMarkerFound(toys, markerId);
        }
      });

    this.el.addEventListener("makerLost",()=>{
        console.log("marker is lost")
        this.handleMarkerLost()
    });
},

askUserId: function () {
    var iconUrl = "./assets/Toy Shop.jpg";
    swal({
      title: "Welcome to TOY SHOP!!",
      icon: iconUrl,
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your uid Ex:(UO1)",
          type: "number",
          min: 1
        }
      },
      closeOnClickOutside: false,
    }).then(inputValue => {
      userId = inputValue;
    });
  },

  handleMarkerFound: function(){

    // Getting today's day
    var todaysDate = new Date();
    var todaysDay = todaysDate.getDay();
    // Sunday - Saturday : 0 - 6
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];


    //Get the toy based on ID
    var toys = toys.filter(toys => toys.id === markerId)[0];

    
    var model = document.querySelector(`#model-${toys.id}`);
    model.setAttribute("visible", true);

    var toys_description = document.querySelector(`#main-plane-${toys.id}`);
    toys_description.setAttribute("visible", true);

    var priceplane = document.querySelector(`#price-plane-${toys.id}`);
    priceplane.setAttribute("visible", true)

    var ratingPlane = document.querySelector(`#rating-plane-${dish.id}`);
    ratingPlane.setAttribute("visible", false);

    //Check if the toy is available 
    if (toys.unavailable_days.includes(days[todaysDay])) {
      swal({
        icon: "warning",
        title: toys.toys_name.toUpperCase(),
        text: "This toy is not available today!!!",
        timer: 2500,
        buttons: false
      });
    } else {

      //Get the toy based on ID
    var toys = toys.filter(toys => toys.id === markerId)[0];

    //Make model visible
    var model = document.querySelector(`#model-${toys.id}`);
    model.setAttribute("visible", true);

    //make Toys Description visible
    var toys_description = document.querySelector(`#main-plane-${toys.id}`);
    toys_description.setAttribute("visible", true);

    //make price plane visible 
    var priceplane = document.querySelector(`#price-plane-${toys.id}`);
    priceplane.setAttribute("visible", true)

    //make rating plane visible
    var ratingPlane = document.querySelector(`#rating-plane-${toys.id}`);
    ratingPlane.setAttribute("visible", false);

      //Changing Model scale to initial scale
      var model = document.querySelector(`#model-${toys.id}`);
      model.setAttribute("position", toys.model_geometry.position);
      model.setAttribute("rotation", toys.model_geometry.rotation);
      model.setAttribute("scale", toys.model_geometry.scale);
    
      //Change the button div visiblity
      var buttonDiv = document.getElementById("button-div")
      buttonDiv.style.display = "flex"

      var ratingButton = document.getElementById("rating-button")
      var orderButtton = document.getElementById("order-button")
      var orderSummaryButtton = document.getElementById("order-summary-button")

      var payButtton = document.getElementById("pay-button")

      if (userId != null) {
        //Handling Click Events
        ratingButton.addEventListener("click", function () {
          swal({
            icon: "warning",
            title: "Rate Toy",
            text: "Work In Progress"
          });
        });


        orderButtton.addEventListener("click", () => {
          var uid;
          userId = id ? (uid = `T0${userId}`) : `T${userId}`;
          this.handleOrder(uid, toys);

          swal({
            icon: "./assets/thumbs-up-colored.png",
            title: "Thanks For Order !",
            text: "TAHNKS FOR YOUR ORDER IT WILL BE PARCELLED TO YOUR HOUSE",
            timer: 2000,
            buttons: false
          });
        });

        orderSummaryButtton.addEventListener("click", () => {
          this.handleOrderSummary()
        })

        payButtton.addEventListener("click",()=> this.handlePayment())

        ratingButton.addEventListener("click",()=> this.handleRatings(toys))
      }
    }
  },

  handleOrder: function (uid, toys) {
    // Reading current orders userId details
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        var details = doc.data();

        if (details["current_orders"][toys.id]) {
          // Increasing Current Quantity
          details["current_orders"][toys.id]["quantity"] += 1;

          //Calculating Subtotal of item
          var currentQuantity = details["current_orders"][toys.id]["quantity"];

          details["current_orders"][toys.id]["subtotal"] =
            currentQuantity * toys.price;
        } else {
          details["current_orders"][toys.id] = {
            item: toys.toys_name,
            price: toys.price,
            quantity: 1,
            subtotal: toys.price * 1
          };
        }

        details.total_bill += toys.price;

        //Updating db
        firebase
          .firestore()
          .collection("users")
          .doc(doc.id)
          .update(details);
      });
  },

  //function to get the toys collection from firestore database
  getToys: async function() {
    return await firebase
      .firestore()
      .collection("Toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },
  getOrderSummary: async function (uid) {
    return await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => doc.data());
  },
  handleOrderSummary: async function () {   

    //Getting userId
    var uid;
    userId <= 9 ? (uid = `T0${userId}`) : `T${userId}`;

    //Getting Order Summary from database
    var orderSummary = await this.getOrderSummary(uid);

    //Changing modal div visibility
    var modalDiv = document.getElementById("modal-div");
    modalDiv.style.display = "flex";

    //Get the table element
    var userBodyTag = document.getElementById("bill-user-body");

    //Removing old tr(table row) data
    userBodyTag.innerHTML = "";

    //Get the cuurent_orders key 
    var currentOrders = Object.keys(orderSummary.current_orders);

    currentOrders.map(i => {

      //Create table row
      var tr = document.createElement("tr");

      //Create table cell or columns for ITEM NAME, PRICE, QUANTITY & TOTAL PRICE
      var item = document.createElement("td");
      var price = document.createElement("td");
      var quantity = document.createElement("td");
      var subtotal = document.createElement("td");

      //Add HTML content 
      item.innerHTML = orderSummary.current_orders[i].item;

      price.innerHTML = "$" + orderSummary.current_orders[i].price;
      price.setAttribute("class", "text-center");

      quantity.innerHTML = orderSummary.current_orders[i].quantity;
      quantity.setAttribute("class", "text-center");

      subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
      subtotal.setAttribute("class", "text-center");

      //Append cells to the row
      tr.appendChild(item);
      tr.appendChild(price);
      tr.appendChild(quantity);
      tr.appendChild(subtotal);

      //Append row to the table
      userBodyTag.appendChild(tr);
    });

    //Create a table row to Total bill
    var totalTr = document.createElement("tr");

    //Create a empty cell (for not data)
    var td = document.createElement("td");
    td.setAttribute("class", "no-line");

    //Create a empty cell (for not data)
    var td1 = document.createElement("td");
    td1.setAttribute("class", "no-line");

    //Create a cell for TOTAL
    var td2 = document.createElement("td");
    td2.setAttribute("class", "no-line text-center");

    //Create <strong> element to emphasize the text
    var strongTag = document.createElement("strong");
    strongTag.innerHTML = "Total";

    td2.appendChild(strongTag);

    //Create cell to show total bill amount
    var td3 = document.createElement("td");
    td3.setAttribute("class", "no-line text-right");
    td3.innerHTML = "$" + orderSummary.total_bill;

    //Append cells to the row
    totalTr.appendChild(td);
    totalTr.appendChild(td1);
    totalTr.appendChild(td2);
    totalTr.appendChild(td3);

    //Append the row to the table
    userBodyTag.appendChild(totalTr);
  },
  handlePayment: function () {
    // Close Modal
    document.getElementById("modal-div").style.display = "none";

    // Getting userId
    var uid;
    userId <= 9 ? (uid = `T0${userId}`) : `T${userId}`;

    //Reseting current orders and total bill
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .update({
        current_orders: {},
        total_bill: 0
      })
      .then(() => {
        swal({
          icon: "success",
          title: "Thanks For Paying !",
          text: "We Hope You Enjoyed Your Food !!",
          timer: 2500,
          buttons: false
        });
      });
  },
  handleRatings: async function (toys) {

    // Getting Table Number
    var uid;
    userId <= 9 ? (uid = `T0${userId}`) : `T${userId}`;
    
    // Getting Order Summary from database
    var orderSummary = await this.getOrderSummary(uid);

    var currentOrders = Object.keys(orderSummary.current_orders);    

    if (currentOrders.length > 0 && currentOrders==toys.id) {
      
      // Close Modal
      document.getElementById("rating-modal-div").style.display = "flex";
      document.getElementById("rating-input").value = "0";

      //Submit button click event
      var saveRatingButton = document.getElementById("save-rating-button");

      saveRatingButton.addEventListener("click", () => {
        document.getElementById("rating-modal-div").style.display = "none";
        //Get the input value(Review & Rating)
        var rating = document.getElementById("rating-input").value;

        //Update db
        firebase
          .firestore()
          .collection("Toys")
          .doc(toys.id)
          .update({
            last_rating: rating
          })
          .then(() => {
            swal({
              icon: "success",
              title: "Thanks For Rating!",
              text: "We Hope You Like Toy !!",
              timer: 2500,
              buttons: false
            });
          });
      });
    } else{
      swal({
        icon: "warning",
        title: "Oops!",
        text: "No toy found to give ratings!!",
        timer: 2500,
        buttons: false
      });
    }

  },
  handleMarkerLost: function (){
    //Change the button div visiblity
    var buttonDiv = document.getElementById("button-div")
    buttonDiv.style.display = "none"
  }
})

///////////////////////////////////////////////////
// cashier function
///////////////////////////////////////////////////
// global variable so can be accessed by both addOrder() and removeOrder()
let ordersArr = [];

// add orders to #order_list
// capture cashier order in ordersArr
const pushToOrderList = (id, item, price) => {
  const itemObj = { id: Number(id), item: item, price: Number(price) };

  if (!ordersArr.some((e) => e.item === itemObj.item)) {
    itemObj.count = 1;
    itemObj.total = itemObj.price;
    ordersArr.push(itemObj);
  } else {
    const index = ordersArr.findIndex((e) => e.item === itemObj.item);
    ordersArr[index].count += 1;
    ordersArr[index].total = _.round(
      Number(ordersArr[index].price * ordersArr[index].count),
      2
    );
  }

  ordersArr.sort((a, b) => {
    let nameA = a.item.toLowerCase();
    let nameB = b.item.toLowerCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
  console.log("This is ordersArr", ordersArr);
  listOrders();
};

// remove orders from #order_list
const removeOrder = (index) => {
  ordersArr[index].count -= 1;
  ordersArr[index].count === 0
    ? ordersArr.splice(index, 1)
    : (ordersArr[index].total = _.round(
        Number(ordersArr[index].price * ordersArr[index].count),
        2
      ));
  listOrders();
};

// add to orders already in #order_list
const addOrder = (index) => {
  ordersArr[index].count += 1;
  ordersArr[index].total = _.round(
    Number(ordersArr[index].price * ordersArr[index].count),
    2
  );
  listOrders();
};

// delete order already in #order_list
const deleteOrder = (index) => {
  ordersArr.splice(index, 1);
  listOrders();
};

// update #order_list display
const listOrders = () => {
  $("#order_list").html("");
  ordersArr.forEach((e, index) => {
    $("#order_list").append(
      `<li >
      <button onclick="addOrder(${index})" class="btn btn-light">
      <i class="fas fa-plus-circle text-danger"></i></button>
      <button onclick="removeOrder(${index})" class="btn btn-light">
      <i class="fas fa-minus-circle text-danger"></i></button>
      ${e.count} x ${e.item} 
      <button onclick="deleteOrder(${index})" class="btn btn-light">
      <i class="far fa-trash-alt text-danger"></i></button>
      <span class="font-italic">$${e.total}</span>
      </li>`
    );
  });
  $("#order_list").append("<hr class='mt-0'>");
  const totalCost = _.round(_.sumBy(ordersArr, "total"), 2).toFixed(2);
  $("#total_cost").html(`Total Cost $${totalCost}`);
  $("#confirm_order").removeClass("hide");
};

// trigger /cashier post route to update sales table
const confirmSale = () => {
  axios({
    method: "post",
    url: "/sales/cashier",
    data: {
      ordersArr,
    },
  })
    .then(() => {
      window.location = "/sales/cashier";
    })
    .catch((err) => {
      throw err;
    });
};

///////////////////////////////////////////////////
// misc function
///////////////////////////////////////////////////
// // show current date time every time page refreshes
// const now = new Date();
// const nowDisp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}, ${now.getDate()}-${
//   now.getMonth() + 1
// }-${now.getFullYear()}`;
const setTime = () => {
  let nowDisp = new Date().toLocaleTimeString("en-US");
  $("#nowdate").html(nowDisp);
};

$(document).ready(() => {
  setTime();
  setInterval(setTime, 1000);
});

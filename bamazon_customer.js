/*
 #######################################################################
 #
 #  FUNCTION NAME : 
 #  AUTHOR        : 
 #  DATE          : 
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : 
 #  PARAMETERS    : 
 #
 #######################################################################
*/

//PACKAGES
var inq = require("inquirer")
var inq2 = inq
var mysql = require("mysql")
const Table = require('cli-table');

//GLOBAL VARIABLES
var con //to be used for MySQL
var prodIdArr = {} //to store the ids of the items
var prodPriceArr = {} //to store the prices of the items

/*
 #######################################################################
 #
 #  FUNCTION NAME : connectSQL
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : connects to the SQL database
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function connectSQL() {

	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "bamazon"
	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : showWelcome
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : shows welcome sign
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function showWelcome() {

	const table = new Table({
	  chars: { 'top': '═' , 'top-mid': '' , 'top-left': '╔' , 'top-right': '╗'
	         , 'bottom': '═' , 'bottom-mid': '' , 'bottom-left': '╚' , 'bottom-right': '╝'
	         , 'left': '║' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
	         , 'right': '║' , 'right-mid': '' , 'middle': '' },
	  colWidths: [45],
	  style: {"padding-left":6,"padding-right":4}

	});

	table.push(
	    [""],
	    ["W E L C O M E  T O  B A M A Z O N"],
	    [""]
	);

	console.log(table.toString());

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : showMenu
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : shows the product details
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function showMenu() {

	const prod_table = new Table({
	  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
	         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
	         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
	         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
	  head: ["ID","PRODUCTS","PRICE","STOCK"],
	  style: { head:['magenta'] },
	  colWidths: [5,50,15,10]
	});

	var sql = "SELECT id, products_name, price, stock_in_quantity FROM products"
	con.query(sql, function (err, result, fields) {
		if (err) throw err
		if (result.length == 0) {
			console.log("\n\nNo products stored in the database. Please insert data to proceed.\n")
		} else {
				for (var p = 0; p < result.length; p++) {
					prod_table.push(
					    [result[p].id, result[p].products_name, '$'+result[p].price,result[p].stock_in_quantity]
					);	
					prodIdArr[result[p].id] = result[p].stock_in_quantity
					prodPriceArr[result[p].id] = result[p].price
				}
				console.log(prod_table.toString());
				con.end()
		  }
	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : main
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : main program
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function main() {

	showWelcome()
	connectSQL()
	showMenu()
	setTimeout(function() {
		promptUser()
	},500)

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : promptUser
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : asks user whether to make a purchase or end access
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function promptUser() {

	inq
      	.prompt([
	        {
	          type: "list",
	          message: "What would you like to do?",
	          choices: ["Make A Purchase","Show The Menu","Exit Bamazon"],
	          name: "contents"
	        }
      	])
      	.then(function(res) {
        
	  		switch (res.contents.toLowerCase()) {
	  			case "make a purchase":
	  				purchaseItems()
	  			break;
	  			case "show the menu":
	  				connectSQL()
					showMenu()
					setTimeout(function() {
						promptUser()
					},500)
	  			break;
	  			case "exit bamazon":
	  				//exit()
	  				console.log("\nThank you for using Bamazon. Have A Good Day!\n")
	  			break;
	  		}


      	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : purchaseItems
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : asks the user what to purchase
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function purchaseItems() {

	inq2
      	.prompt([
	        {
	          type: "input",
	          message: "Please provide the item ID:",
	          name: "itemID",
	          validate: function(ch) {

	          	if(prodIdArr[ch])
	          		return true

	          }
	        },
	        {
	          type: "input",
	          message: "How many would you like to purchase:",
	          name: "itemCnt",
	        }
      	])
      	.then(function(res) {
        
	  		if (prodIdArr[res.itemID] < res.itemCnt) {
	  			console.log("\nInsufficient Quantity!\n")
	  			purchaseItems()
	  		} else {
	  			var p = parseFloat(res.itemCnt * prodPriceArr[res.itemID]).toFixed(2)
	  			console.log("\nYour total price is $"+p+"\n")
	  			
	  			inq2
	  				.prompt([
		  				{
		  					type: "confirm",
					        message: "Would you like to continue?",
					        name: "confirm",
					        default: true    
		  				}
	  				])
	  				.then(function(r) {

	  					if (r.confirm) {
	  						connectSQL()
				  			setTimeout(function() {
				  				updateDatabase(res.itemID,res.itemCnt)
				  			},500)
	  					} else {
	  						console.log("\nThank you for using Bamazon. Have A Good Day!\n")
	  					  }

	  				})
	  			
	  		  }


      	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : updateDatabase
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : updates the database with the new information
 #  PARAMETERS    : id, quantity
 #
 #######################################################################
*/

function updateDatabase(id,num) {

	var newcnt = prodIdArr[id] - num
	var sql = "UPDATE products SET stock_in_quantity="+newcnt+" WHERE id="+id
	con.query(sql, function (err, result, fields) {
		if (err) throw err
		console.log("\nDatabase Updated\n")
		showMenu()
		setTimeout(function() {
			promptUser()
		},500)
	})

}

/* FUNCTION CALL */
main()



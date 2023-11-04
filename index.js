import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
// customer Class
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
// class Bank
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accobj) {
        let NewAccounts = this.account.filter((acc) => acc.accNumber !== accobj.accNumber);
        this.account = [...NewAccounts, accobj];
    }
}
let myBank = new Bank();
// customer Create
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("female");
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number());
    const cus = new Customer(fName, lName, 25 * i, "female", num, 1040 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}
// Bank Functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please Select the Service",
            choices: ["view Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
        });
        //  view Balance
        if (service.select == "view Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your Account Balance is ${chalk.bold.blueBright(`$${account.balance}`)}`);
            }
        }
        //  Cash Withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter Your Amount.",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Mojuda balance nakafi hai..."));
                }
                let newBalance = account.balance - ans.rupee;
                // transaction method call
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        //  Cash Deposit
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter Your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter Your Amount.",
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee;
                // transaction method call
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankService(myBank);

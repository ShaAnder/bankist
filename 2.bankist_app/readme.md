# BANKIST

## Table Of Contents

    - [Introduction](#introduction)
        - [Why This?](#why-this?)

    - [Project Brief](#project-brief)
        - [In Depth Description](#in-depth-description)
        - [Working Rundown](#how-it-works)

    - [Learning Points & Takeaway](#learning-points-&-takeaway)

    - [Version History](#version-history)

    - [Misc](#misc)

## Introduction

This is my second major Javascript project from the Javascript complete course by Jonas Scmedtmann, it's a perfect example of shaocasing my skills up to and including Arrays. Originally found on [Udemy, The Javascript Complete Course by Jonas Scmedtmann](https://www.udemy.com/course/the-complete-javascript-course/), the project is a minimalist banking mock app that allows users to log in, check their balances do transactions and delete their account.

### Why This?

This is the second major project from the Javascript complete course I am attending, with a large focus on building working array structures and utilizing them to make a working mock application.

## Project Brief

### In Depth Description

On the indepth side this project utilizes arrays and array methods at its core, it was largely designed as a follow along project for people to learn how arrays work and gain a core understanding of them. The project utlizes CSS / HTML and JS to operate and mixes in dom manipulation, function calling and array creation and mutation to operate and execute it's functions

### Working Breakdown

As this is a much larger program instead of describing most of it's working parts this flowchart will do most of the explaining alongside some small explanation snippets.

![bankistflowchart](https://github.com/ShaAnder/bankist/assets/129494996/80c76f8e-cc02-41ac-833a-ce3ee4947880)

On the backend we have a database that holds the user account data, this database is created on first launch of the code (for the moment as this is an offline app) and contains some dummy accounts for the user to work with and test out the code with.

When logging in the user is presented with a login screen, this login screen will ask for the user credentials, if the account cannot be found we provide a button for the user to create an account.

Once a user creates an account it then assigns them a random account number, which will be required for user transactions, As well as directing them to the login page once more

Upon successful login the user is presented with the ui which will display their account data, and a welcome message, as well as this all the functionality the app brings.

#### FUNCTIONALITY

The app has several working parts and things that it can do:

- User can transfer money, as a banking app the user should be allowed to transfer money to another registered user, as this is currently a mock app, the only accounts that this can be done with are the test accounts that come preloaded but as this app is developed with a server infastructure, it will be other users. In any case the functionality works by adding a negative transaction to the users account and a positive transaction to the recipients account.

- User can request a loan, as it currently stands the mock banking app allows the user to request a loan and if the user does this the app will calculate if the loan amount is >= 10% of the amount in the users account. If the loan amount is greater it will deny them the loan, if not it will deposit it into the users account

- We also allow the user to sort their account, if the user wants to sort their transaction history based on withdrawals or by date they can, by hitting the various sort buttons

- Finally on the list of main user functionality we give the user the ability to delete or close their account, this will delete the data from the db, log the user out and then move to the login screen

- Other smaller functionalities include a % chance of an account fee being removed from the users account on login (to similate account fees) as well as a login timer that automatically logs the user out when the timer expires

## Learning Points & Takeaway

This project was a great example of arrays and how they work and it's one I look forward to continuing as I expand and flesh it out.

## Version History

v.01 - Created and completed the basic bankist app as outlined in the course lectures.

v.02 - updated readme and the bankist flowchart, setup ui redesign branch

# **GadgetIT.com - Full-Stack E-Commerce Platform**

**GadgetIT.com** is a comprehensive full-stack e-commerce platform designed for managing gadgets and PC components. The platform includes a dynamic user interface and a <b>powerful admin dashboard</b>, built with React.js, Node.js, Express.js, and MySQL.

## **Project Overview**

GadgetIT.com is an e-commerce platform with a user-friendly frontend and an extensive admin dashboard. It is designed to facilitate the management of products, users, and orders, providing both customers and administrators with a seamless and efficient experience.

## **Features**

### **User Interface Features**

- **Log In Authentication**: Used nodemailer module for user confirmation and hashed password for user security purpose.
- **Product Search and Filtering**: Users can search and filter products by various criteria.
- **Product Interaction**: Simulate buying operations, manage a shopping cart, and leave ratings and reviews for products.
- **Question and Answer Section**: Users can ask questions about products and view answers.
- **User Rating**: Users can give rating to any product.
- **Responsive Design**: The platform is optimized for desktops, tablets, and mobile phones.
- **User Account Management**: Features account creation, profile customization, password recovery, and activity tracking.
- **Dynamic Pricing**: Prices adjust based on demand, availability, and promotions.
- **Image Upload and Display**: Users and admins can upload and view product images.
- **Dynamic Product Advertising**: Available dynamic advertising system.
- **Product Sorting**: Products can be sort by different criteria.
- **Pagination System**: Pagination supports to any group of products.
- **Product Cart**: Products can be added to carts.

### **Admin Interface Features**

The admin dashboard comprises eight main pages:

1. **Dashboard**

   - Displays key metrics:
     - Number of Users
     - Number of Suppliers
     - Total Sales
     - Cost
     - Revenue
     - Profit
     - Number of Purchases
     - Cancelled Orders
     - Returns
     - Quantity in Hand
     - Expected Receipts
     - Low Stock Items
     - Item Groups
     - Number of Items

2. **Inventory**

   - **Product Management**:
     - Search and filter products
     - Categorize products
     - Pagination support for product table
     - Hide/Unhide products
     - Delete products
     - Add new products

3. **Production**

   - **Production Management**:
     - Search and filter production-related data
     - CRUD operations for database columns
     - Manage columns, sort options, and key features

4. **Orders**

   - **Order Management**:
     - View and manage orders with pagination
     - Orders are dynamically dropdowned
     - Filter and add new orders

5. **Reports**

   - **Reporting** (Feature to be implemented):
     - Generate and view various reports related to sales, inventory, and user activity

6. **Users**

   - **User Management**:
     - View and manage user details, questions, reports, and ratings
     - Search, sort, and manage user accounts
     - Additional functionalities to be added

7. **Support**

   - **Support Management**:
     - Manage user questions and ratings
     - Future enhancements will include additional support features

8. **Settings**
   - **Configuration Management**:
     - Manage advertisement images, icons, descriptions, and featured products on the home screen
     - Serial and organize images, descriptions, and featured products

## **Technologies Used**

- **Frontend**:
  - HTML
  - CSS
  - JavaScript
  - React.js
- **Backend Server**:
  - Express.js
- **Database**:
  - MySQL
 
# Live Demo
- [live link](https://gadget-it.vercel.app/)

## For Admin access
- Email: admin@gmail.com
- Password: aA1!123 ``I trust you, do not request unnecessary server request and not change huge amount of data please!``

## Folder Structure
```
├── client
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── public
    │   ├── index.css
    │   └── index.html
    └── src
    │   ├── App.js
    │   ├── HOOKS
    │       ├── CategoryChildContainer.js
    │       ├── CategoryRadioGroup.js
    │       ├── DisplayBangladeshTime.js
    │       ├── GetCategoryName.js
    │       ├── GetDate.js
    │       ├── GetDiscountedPrice.js
    │       ├── GetMainTable.js
    │       ├── GetSortObjects.js
    │       ├── HomePagination.js
    │       ├── MakeDefendants.js
    │       ├── OfferCountdown.js
    │       ├── Pagination.js
    │       ├── ParentDescendant.js
    │       ├── ProductCart.js
    │       ├── SearchInventory.js
    │       ├── SearchOfferProducts.js
    │       ├── SearchOffers.js
    │       ├── SearchProduction.js
    │       ├── SearchQuestions.js
    │       ├── SearchRatings.js
    │       ├── SearchSelectHomeProducts.js
    │       ├── SearchUserPreOrder.js
    │       ├── SearchUserReport.js
    │       ├── SearchUsersPage.js
    │       └── UseManageColumns.js
    │   ├── api
    │       ├── AdminRenderApi.js
    │       ├── Admin_Api.js
    │       ├── Api_Dashboard.js
    │       ├── Api_Inventory.js
    │       ├── Api_Order.js
    │       ├── Api_Outer_Page.js
    │       ├── Api_Production.js
    │       ├── Api_Report.js
    │       ├── Api_Setting.js
    │       ├── Api_Support.js
    │       ├── Api_Users.js
    │       ├── ForgotPassApi.js
    │       ├── GetMenuItems.js
    │       ├── Home_State.js
    │       ├── LoginPost.js
    │       ├── Reset_HomeState.js
    │       ├── SetAdmin.js
    │       ├── SignInPost.js
    │       ├── User_Home.js
    │       └── User_Products.js
    │   ├── assets
    │       ├── main
    │       │   ├── Galaxy-Z-Fold6-Slider-3091.webp
    │       │   └── iPhone-15-Pro-Max-Slider-2949.webp
    │       └── sub
    │       │   ├── 07_01-6712.jpg
    │       │   ├── Apple-Airpods-pro-2nd-Gen-Type-C-4990.webp
    │       │   ├── Middle-Banner_02-5038.png
    │       │   └── OnePlus-Watch-2-1578.webp
    │   ├── components
    │       ├── AdminHome
    │       │   ├── AddProducts.js
    │       │   ├── AdminSearchBar.js
    │       │   ├── AdvertisementImages.js
    │       │   ├── CreateNewCategory.js
    │       │   ├── CreateNewOffer.js
    │       │   ├── FeaturedCategoryICON.js
    │       │   ├── HomeViewDescriptions.js
    │       │   ├── LeftSide.js
    │       │   ├── MainBody.js
    │       │   ├── ManageColumns.js
    │       │   ├── ManageFooter.js
    │       │   ├── ManageOffers.js
    │       │   ├── ManageVendors.js
    │       │   ├── MyChart.js
    │       │   ├── ProductionTable.js
    │       │   ├── ProductionTableManage.js
    │       │   ├── SalesManagement.js
    │       │   ├── SelectHomeProducts.js
    │       │   ├── SelectOfferProducts.js
    │       │   ├── ShowAdmin.js
    │       │   ├── ShowNotifications.js
    │       │   ├── UpperSide.js
    │       │   ├── UserPreOrder.js
    │       │   ├── UserQuestions.js
    │       │   ├── UserRating.js
    │       │   └── UserReportPage.js
    │       ├── UserHome
    │       │   ├── Account
    │       │   │   ├── AccountButtonStates.js
    │       │   │   ├── Address.js
    │       │   │   ├── ChangePassword.js
    │       │   │   ├── MyOrders.js
    │       │   │   ├── OrdersPage.js
    │       │   │   ├── PersonalInformation.js
    │       │   │   ├── Report.js
    │       │   │   ├── UserMessages.js
    │       │   │   ├── UserOrderPaymentPage.js
    │       │   │   └── UserOrders.js
    │       │   ├── ChangePasswordValidation.js
    │       │   ├── ExtraSubAdd.js
    │       │   ├── FeaturedProducts.js
    │       │   ├── ForgotPass.js
    │       │   ├── ForgotPassValidation.js
    │       │   ├── GroupProductSorting.js
    │       │   ├── LoginValidations.js
    │       │   ├── MainProductCarts.js
    │       │   ├── NewArrival.js
    │       │   ├── ProductDescription.js
    │       │   ├── QuestionForm.js
    │       │   ├── RatingForm.js
    │       │   ├── ReadyForOrder.js
    │       │   ├── RecentProducts.js
    │       │   ├── SignInValidations.js
    │       │   ├── SwiperMainAdd.js
    │       │   ├── UpperFeature.js
    │       │   ├── UpperImage.js
    │       │   ├── UserFeaturedIcons.js
    │       │   ├── UserHomeDescription.js
    │       │   ├── UserLogIn.js
    │       │   ├── UserQuestions.js
    │       │   ├── UserRating.js
    │       │   ├── UserSignIn.js
    │       │   ├── UserSupportBoxes.js
    │       │   └── ViewProductSwiper.js
    │       └── ui
    │       │   ├── SkeletonLoader.js
    │       │   └── styles
    │       │       └── skeleton.module.css
    │   ├── context
    │       ├── UseProvider.js
    │       ├── reducer.js
    │       └── useData.js
    │   ├── index.js
    │   ├── layout
    │       ├── Footer.js
    │       ├── NavBar.js
    │       └── TopNav.js
    │   ├── pages
    │       ├── ADMIN
    │       │   ├── AdminHomePage.js
    │       │   ├── PageEight.js
    │       │   ├── PageFive.js
    │       │   ├── PageFour.js
    │       │   ├── PageOne.js
    │       │   ├── PageSeven.js
    │       │   ├── PageSix.js
    │       │   ├── PageThree.js
    │       │   └── PageTwo.js
    │       ├── LoadingPage.js
    │       ├── RandomErrorPage.js
    │       ├── RouteErrorPage.js
    │       ├── ServerIssuePage.js
    │       └── UserHome
    │       │   ├── Account.js
    │       │   ├── Carts.js
    │       │   ├── EasyCheckout.js
    │       │   ├── GroupProducts.js
    │       │   ├── OfferCartProducts.js
    │       │   ├── Offers.js
    │       │   ├── PreOrder.js
    │       │   ├── UserHomePage.js
    │       │   ├── VerifyOrderEmail.js
    │       │   └── ViewProduct.js
    │   ├── routes
    │       ├── AdminRoutes.js
    │       ├── RoutesHandle.js
    │       └── UserHomeRoutes.js
    │   └── styles
    │       ├── AdminHome
    │           ├── AdvertisementImages.module.css
    │           ├── CreateNewTable.module.css
    │           ├── HomeViewDes.module.css
    │           ├── ManageColumns.module.css
    │           ├── ManageFooter.module.css
    │           ├── ManageOffers.module.css
    │           ├── ManageVendors.module.css
    │           ├── MoreInformation.module.css
    │           ├── NewOrderPlaced.module.css
    │           ├── PageEight.module.css
    │           ├── PageFive.module.css
    │           ├── PageFour.module.css
    │           ├── PageSeven.module.css
    │           ├── PageSix.module.css
    │           ├── PageThree.module.css
    │           ├── PageTwo.module.css
    │           ├── Pagination.module.css
    │           ├── ProductionDetails.module.css
    │           ├── SalesManagement.module.css
    │           ├── UserRating.module.css
    │           ├── UserReportPage.module.css
    │           ├── addproducts.module.css
    │           ├── admin.home.module.css
    │           ├── page.one.module.css
    │           ├── pageseven.userquestion.module.css
    │           └── show.notification.module.css
    │       ├── ErrorAndLoading
    │           ├── ServerIssuePage.module.css
    │           ├── error.module.css
    │           └── loading.module.css
    │       └── HomePageStyles
    │           ├── Account.module.css
    │           ├── Address.module.css
    │           ├── CategoryChildContainer.module.css
    │           ├── ChangePassword.module.css
    │           ├── EasyCheckout.module.css
    │           ├── ExtraAdd.module.css
    │           ├── FeaturedProducts.module.css
    │           ├── Footer.module.css
    │           ├── GroupProductCatrs.module.css
    │           ├── GroupProductSorting.module.css
    │           ├── GroupProducts.module.css
    │           ├── HomePagination.module.css
    │           ├── MainHome.css
    │           ├── MyOrders.module.css
    │           ├── OfferCartProducts.module.css
    │           ├── ParentDescendant.module.css
    │           ├── PersonalInformation.module.css
    │           ├── PreOrderPage.module.css
    │           ├── ProductCart.module.css
    │           ├── ProductDEscription.module.css
    │           ├── ProductSectionCart.module.css
    │           ├── Questions.module.css
    │           ├── ReadyForOrder.module.css
    │           ├── RecentView.module.css
    │           ├── SignIn.module.css
    │           ├── SwiperMainAdd.module.css
    │           ├── UserFeaturedIcons.module.css
    │           ├── UserHomeDescription..module.css
    │           ├── UserHomePage.module.css
    │           ├── UserHomeRoutePage.module.css
    │           ├── UserMessage.module.css
    │           ├── UserOfferCartPage.module.css
    │           ├── UserOrder.module.css
    │           ├── UserOrderPaymentPage.module.css
    │           ├── UserReport.module.css
    │           ├── UserSupportBoxes..module.css
    │           ├── VerifyOrderEmail.module.css
    │           ├── ViewProduct.module.css
    │           ├── topnav.module.css
    │           └── uppernav.module.css
└── server
    ├── .gitignore
    ├── app.js
    ├── config
        ├── DB.js
        ├── auth.crypto.js
        ├── invoice.send.js
        ├── passport.js
        ├── performQuery.js
        ├── send.mail.controller.js.js
        └── send.order.confirmation.email.js
    ├── controllers
        ├── admin.dashboard.controller.js
        ├── product.inventory.controllers.js
        ├── product.order.controller.js
        ├── product.outer.controller.js
        ├── product.post.controller.js
        ├── product.production.controller.js
        ├── product.report.controller.js
        ├── product.setting.controller.js
        ├── product.support.controller.js
        ├── product.users.page.controller.js
        ├── production.management.controller.js
        ├── products.controllers.js
        ├── user.controllers.js
        ├── user.crud.controller.js
        └── user.home.contents.controller.js
    ├── index.js
    ├── models
        ├── admin.dashboard.model.js
        ├── product.inventory.model.js
        ├── product.order.model.js
        ├── product.outer.model.js
        ├── product.post.models.js
        ├── product.production.model.js
        ├── product.report.model.js
        ├── product.setting.model.js
        ├── product.support.model.js
        ├── product.users.page.model.js
        ├── production.manage.model.js
        ├── products.models.js
        ├── user.crud.model.js
        ├── user.home.contents.model.js
        └── user.model.js
    ├── package.json
    ├── routes
        ├── admin.dashboard.router.js
        ├── product.inventory.router.js
        ├── product.order.router.js
        ├── product.outer.router.js
        ├── product.post.router.js
        ├── product.production.router.js
        ├── product.report.router.js
        ├── product.setting.router.js
        ├── product.support.router.js
        ├── product.users.page.router.js
        ├── products.router.js
        ├── users.home.contents.js
        └── users.router.js
```

## **Installation**

To set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ByteCrister/Gadget-IT.com.git
   cd GadgetIT.com
   ```

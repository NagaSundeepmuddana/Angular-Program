import { Component} from '@angular/core';
import { IProduct } from './product.model';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    // styles: ['thead{color:teal}', 'td{color:tomato}']
    styleUrls: ['./product.component.css'],
    styles: [
        `.online{
            background-color:wheat
        }`
    ]
})

export class ProductComponent {

    title: string = 'Product App';
    showTable = true;
    showImage = false;
    userInput;
    serverStatus = 'offline';
    currencynamee = 'INR';

    constructor() {
        this.serverStatus = Math.random() < 0.5 ? 'Online' : 'Offline';
    }

    products: IProduct[] = [
        {
            _id: '5a05dacc734d1d68d42d31f3',
            productId: 1,
            "productName": "Leaf Rake",
            "productCode": "GDN-0011",
            "releaseDate": "March 19, 2016",
            "description": "Leaf rake with 48-inch wooden handle.",
            "price": 19.95,
            "starRating": 3.5,
            "imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
          },
          {
            "_id": "5a05daec734d1d68d42d32ca",
            "productId": 2,
            "productName": "Garden Cart",
            "productCode": "GDN-0023",
            "releaseDate": "March 18, 2016",
            "description": "15 gallon capacity rolling garden cart",
            "price": 32.99,
            "starRating": 4.2,
            "imageUrl": "http://openclipart.org/image/300px/svg_to_png/58471/garden_cart.png"
          },
          {
            _id: '5a05dacc734d1d68d42d31f3',
            productId: 3,
            "productName": "Leaf test Rake",
            "productCode": "GDN-0011",
            "releaseDate": "March 1, 2016",
            "description": "Leaf rake with 48-inch wooden handle.",
            "price": 19.95,
            "starRating": 3.5,
            "imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
          },
          {
            "_id": "5a05daec734d1d68d42d32ca",
            "productId": 4,
            "productName": "Garden Cart 1",
            "productCode": "GDN-0023",
            "releaseDate": "March 9, 2016",
            "description": "15 gallon capacity rolling garden cart",
            "price": 32.99,
            "starRating": 4.2,
            "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/81UkZNZICyL._SX466_.jpg"
          },
          {
            _id: '5a05dacc734d1d68d42d31f3',
            productId: 5,
            "productName": "Leaf Rake",
            "productCode": "GDN-0011",
            "releaseDate": "March 19, 2016",
            "description": "Leaf rake with 48-inch wooden handle.",
            "price": 19.95,
            "starRating": 3.5,
            "imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
          },
          {
            "_id": "5a05daec734d1d68d42d32ca",
            "productId": 6,
            "productName": "Garden Cart",
            "productCode": "GDN-0023",
            "releaseDate": "March 18, 2016",
            "description": "15 gallon capacity rolling garden cart",
            "price": 32.99,
            "starRating": 4.2,
            "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/81UkZNZICyL._SX466_.jpg"
          },
          {
            _id: '5a05dacc734d1d68d42d31f3',
            productId: 7,
            "productName": "Leaf Rake",
            "productCode": "GDN-0011",
            "releaseDate": "March 19, 2016",
            "description": "Leaf rake with 48-inch wooden handle.",
            "price": 19.95,
            "starRating": 3.5,
            "imageUrl": "https://www.telegraph.co.uk/content/dam/health-fitness/2019/02/08/pinchinghand_trans_NvBQzQNjv4BqdODRziddS8JXpVz-XfUVR2LvJF5WfpqnBZShRL_tOZw.jpg?imwidth=450"
          }
    ];

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    getColor() {
        return this.serverStatus === 'Online' ? 'green' : 'red';
    }

}

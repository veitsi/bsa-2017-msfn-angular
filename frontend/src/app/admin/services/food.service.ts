import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { IHttpReq } from '../../models/http-req';
import { IFood } from '../../models/food';
import { IFoodType } from '../../models/food-type';


@Injectable()
export class FoodService {

    constructor(private httpService: HttpService) {}

    getAllFoodTypes(callback): void {
        /*const request: IHttpReq = {
            url: 'api/food-type',
            method: 'GET',
            body: {}
        };
        this.httpService.sendRequest(request)
            .then( data => {
                callback(data);
            });*/
       const foodTypes: IFoodType[] = [
           {
               name: 'Fish',
               description: 'Lorem ipsum dolor sit amet,' +
               'consectetur adipiscing elit, sed do eiusmod ' +
               'tempor incididunt ut labore et dolore magna aliqua.',
               isRemoved: false
           },
           {
               name: 'Vegetables',
               description: 'Lorem ipsum dolor sit amet,' +
               'consectetur adipiscing elit, sed do eiusmod ' +
               'tempor incididunt ut labore et dolore magna aliqua.',
               isRemoved: false
           },
           {
               name: 'Fruit',
               description: 'Lorem ipsum dolor sit amet,' +
               'consectetur adipiscing elit, sed do eiusmod ' +
               'tempor incididunt ut labore et dolore magna aliqua.',
               isRemoved: false
           },
           {
               name: 'Nuts and seeds',
               description: 'Lorem ipsum dolor sit amet,' +
               'consectetur adipiscing elit, sed do eiusmod ' +
               'tempor incididunt ut labore et dolore magna aliqua.',
               isRemoved: false
           },
           {
               name: 'Dairy products',
               description: 'Lorem ipsum dolor sit amet,' +
               'consectetur adipiscing elit, sed do eiusmod ' +
               'tempor incididunt ut labore et dolore magna aliqua.',
               isRemoved: false
           },
           {
               name: 'Baked goods',
               description: 'Lorem ipsum dolor sit amet,' +
               'consectetur adipiscing elit, sed do eiusmod ' +
               'tempor incididunt ut labore et dolore magna aliqua.',
               isRemoved: false
           },
       ];
       callback(foodTypes);
    }
    addFoodType(body: IFoodType, callback): void {
        const request: IHttpReq = {
            url: 'api/food-type',
            method: 'POST',
            body: body,
            successMessage: 'Added',
            failMessage: 'Failed to add food type'
        };
        this.httpService.sendRequest(request)
            .then(
                data => callback(data)
            );
    }
    deleteFoodType(body: IFoodType, callback): void {
        body.isRemoved = true;
        this.updateFoodType(body, callback);
    }
    updateFoodType(body: IFoodType, callback) {
        const request: IHttpReq = {
            url: 'api/food-type',
            method: 'PUT',
            body: body
        };
        this.httpService.sendRequest(request)
            .then(
                data => callback(data)
            );
    }
    getAllFoods(callback): void {
        const request: IHttpReq = {
            url: 'api/food',
            method: 'GET',
            body: {}
        };
        this.httpService.sendRequest(request)
            .then( data => {
                callback(data);
            });
    }
    addFood(body: IFood, callback): void {
        const request: IHttpReq = {
            url: 'api/food',
            method: 'POST',
            body: body,
            successMessage: 'Added',
            failMessage: 'Failed to add food'
        };
        this.httpService.sendRequest(request)
            .then(
                data => callback(data)
            );
    }
    getAllFood(callback): void {
        /*const request: IHttpReq = {
            url: 'api/food-type',
            method: 'GET',
            body: {}
        };
        this.httpService.sendRequest(request)
            .then( data => {
                callback(data);
            });*/
        const food: IFood[] = [
            {
                name: 'qwerty',
                foodType: 'type',
                customUserId: ''
            },
            {
                name: 'milk',
                foodType: 'Diary products',
                customUserId: '123'
            },
            {
                name: 'gtyut',
                foodType: 'nuts',
            },
            {
                name: 'jhfhjfhj',
                foodType: 'sweet',
            },
            {
                name: 'macaroon',
                foodType: 'baked',
            },
            {
                name: 'cheese',
                foodType: 'Diary products',
                customUserId: '123'
            },
            {
                name: 'grdffg',
                foodType: 'baj',
            },
            {
                name: 'ede',
                foodType: 'sweet',
            },
        ];
        callback(food);
    }
    deleteFood(body: IFood, callback): void {
        body.isRemoved = true;
        this.updateFood(body, callback);
    }
    updateFood(body: IFood, callback) {
        const request: IHttpReq = {
            url: 'api/food',
            method: 'PUT',
            body: body
        };
        this.httpService.sendRequest(request)
            .then(
                data => callback(data)
            );
    }
    sortfoodTypesData(data, column, direction = 'asc' || 'desc') {
        return data.sort((a, b) => {
            let propA = '';
            let propB = '';
            switch (column) {
                case 'name': [propA, propB] = [a.name, b.name]; break;
                case 'description': [propA, propB] = [a.description, b.description]; break;
            }
            const valueA = isNaN(+propA) ? propA : +propA;
            const valueB = isNaN(+propA) ? propB : +propB;
            return (valueA < valueB ? -1 : 1) * (direction === 'asc' ? 1 : -1);
        });
    }
    sortFoodData(data, column, direction = 'asc' || 'desc') {
        return data.sort((a, b) => {
            let propA = '';
            let propB = '';
            switch (column) {
                case 'name': [propA, propB] = [a.name, b.name]; break;
                case 'foodType': [propA, propB] = [a.foodType, b.foodType]; break;
            }
            const valueA = isNaN(+propA) ? propA : +propA;
            const valueB = isNaN(+propA) ? propB : +propB;
            return (valueA < valueB ? -1 : 1) * (direction === 'asc' ? 1 : -1);
        });
    }
}
import { Component, OnInit } from '@angular/core';
import { IFood } from '../../../../models/food';
import { IFoodType } from '../../../../models/food-type';
import { FoodPlanService } from './../food-plan.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    foods: IFood[];
    foodsStatic: IFood[];
    types: IFoodType[];
    showItem = {};
    typesDepth = [];
    filtered = null;
    selectedType = '';
    sortDirection = {
        food: '',
        vendor: ''
    };
    selectedFood = [];
    selectedFoodID = [];
    currenpMealProducts: any;
    subscription: Subscription;
    measurements = {
        'Weight': 'g',
        'Liquid': 'ml',
        'Quantity': 'pc',

    };
    constructor(
        public foodPlanService: FoodPlanService,
    ) {
        this.subscription = this.foodPlanService.getProductList().subscribe(products => { this.currenpMealProducts = products; });   
    }

    ngOnInit() {
        this.foodPlanService.getFood(res => {
            res.forEach((el, ind) => {
                el.checked = false;
                el.count = 0;
                return true;
            });
            this.foods = res;
            this.foodsStatic = res;
        });
        this.foodPlanService.getFoodTypes(res => {
            this.types = res;
            this.createTypesDepth(res);
        });
    }

    createTypesDepth(types) {
        let parentIndex = 0;
        let parentIndex2 = 0;
        types.forEach((el, i) => {
            if (el.depthLvl === 1) {
                this.typesDepth.push(el);
                parentIndex = this.typesDepth.length - 1;
                types.forEach((child1, i2) => {
                    if (child1.depthLvl === 2 && child1.parentType.name === el.name) {
                        if (!this.typesDepth[parentIndex].hasOwnProperty('children')) {
                            this.typesDepth[parentIndex].children = [];
                        }
                        this.typesDepth[parentIndex].children.push(child1);
                        parentIndex2 = this.typesDepth[parentIndex].children.length - 1;
                        types.forEach(child2 => {
                            if (child2.depthLvl === 3 && child2.parentType.name === child1.name) {
                                if (!this.typesDepth[parentIndex].children[parentIndex2].hasOwnProperty('children')) {
                                    this.typesDepth[parentIndex].children[parentIndex2].children = [];
                                }
                                this.typesDepth[parentIndex].children[parentIndex2].children.push(child2);
                            }
                        });
                    }
                });
            }
        });
    }

    toggleChild(id) {
        if (this.showItem[id] === true) {
            this.showItem[id] = false;
        } else {
            this.showItem[id] = true;
        }
    }

    searchType(query) {
        if (query.length > 0) {
            this.filtered = this.types.filter(el => {
                return el.name.toLowerCase().includes(query.toLowerCase());
            });
        } else {
            this.filtered = null;
        }
    }

    chooseType(type) {
        this.selectedType = type._id;
        const arrOfTypeNames = this.getArrOfTypeNames(type);
        this.foods = this.foodsStatic.filter(el => {
            if (arrOfTypeNames.includes(el.foodType._id)) {
                return true;
            }
        });
    }

    getArrOfTypeNames(type) {
        const arrOfTypes = [];
        arrOfTypes.push(type._id);
        if (type.children) {
            type.children.forEach(el => {
                arrOfTypes.push(el._id);
                if (el.children) {
                    el.children.forEach(el2 => {
                        arrOfTypes.push(el2._id);
                    });
                }
            });
        }
        return arrOfTypes;
    }

    searchName(query) {
        this.selectedType = '';
        this.foods = this.foodsStatic.filter(el => {
            return el.name.toLowerCase().includes(query.toLowerCase());
        });
    }

    sortFood(key: string) {
        this.toggleSortDirection(key);
        this.foodPlanService.sortData(this.foods, key, this.sortDirection[key]);
    }

    toggleSortDirection(key: string) {
        if (this.sortDirection[key] === 'desc') {
            this.sortDirection[key] = 'asc';
        } else {
            this.sortDirection[key] = 'desc';
        }
    }

    selectFood(event) {
        const id = event.source.id;
        let selectedFoodID = '';

        const food = this.foods.find(function (el) {
            if (el._id === id) {
                selectedFoodID = el._id;
                return true;
            }
        });

        if (event.source.checked) {
            this.selectedFood.push(food);
            this.selectedFoodID.push(selectedFoodID);
        } else {
            this.selectedFood = this.selectedFood.filter(function (el) {
                return el._id !== id;
            });
            this.selectedFoodID = this.selectedFoodID.filter(function (el) {
                return el !== id;
            });
        }
        console.log(this.selectedFood);
        this.foodPlanService.sendProductList(this.selectedFood);
    }

    addOne(id) {
        let formatedItem = {};
        this.foods.forEach((food) => {
            if(food._id === id){
                formatedItem = this.formateFoodItem(food);
                food.checked = false;
                food.count = 0;
                console.log(food);
            }
            return true;
            
        });
        // const formatedItem = this.formateFoodItem(item);

        let sendList = {
            list: [],
            show: true
        };
        if(this.currenpMealProducts){
            sendList = this.currenpMealProducts.data;
        }
        sendList.list.push(formatedItem);
        
        this.foodPlanService.sendProductList(sendList);
    }

    formateFoodItem(item){
        let kcal = 0;
        if(item.measure === 'Weight' || item.measure === 'Liquid') {
            kcal = item.kcal*item.count/100;
        } else {
            kcal = item.kcal;
        }
        kcal = Math.round(kcal);
        
        return {
            _id: item._id,
            name: item.name,
            quantity: item.count,
            kcal: kcal
        };
    }
}

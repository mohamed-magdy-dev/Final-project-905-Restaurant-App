import { Component, OnInit } from '@angular/core';

export interface Chef {
  name: string;
  designation: string; 
  image: string;         
  facebook: string;
  twitter: string;
  instagram: string;
}

@Component({
  selector: 'app-chefs',
  templateUrl: './chefs.component.html',
  styleUrls: ['./chefs.component.css']
})
export class ChefsComponent implements OnInit {

  chefsList: Chef[] = [
    {
      name: 'Ahmed moahmed',
      designation: 'Pizza',
      image: 'team-1.jpg',
      facebook: 'https://facebook.com/chef1',
      instagram: 'https://instagram.com/chef1',
      twitter: 'https://twitter.com/chef1'
    },
    {
      name: 'Osama Alem',
      designation: 'Chicken shawarma',
      image: 'team-2.jpg',
      facebook: 'https://facebook.com/chef2',
      instagram: 'https://instagram.com/chef2',
      twitter: 'https://twitter.com/chef2'
    },
    {
      name: 'Ayman ali',
      designation: 'Burger',
      image: 'team-3.jpg',
      facebook: 'https://facebook.com/chef3',
      instagram: 'https://instagram.com/chef3',
      twitter: 'https://twitter.com/chef3'
    },
    {
      name: 'Nasser Karim',
      designation: 'Candies',
      image: 'team-4.jpg',
      facebook: 'https://facebook.com/chef4',
      instagram: 'https://instagram.com/chef4',
      twitter: 'https://twitter.com/chef4'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getAnimationDelay(index: number): string {
    return (0.1 + (index * 0.2)) + 's';
  }
}

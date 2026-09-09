import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../service/contact.service';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.css']
})
export class MyMessagesComponent implements OnInit {

  messages: any[] = [];
  isLoading: boolean = true;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.loadMessages();
    this.markMessagesAsRead();
  }

  loadMessages() {
    this.contactService.getMyMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching messages', err);
        this.isLoading = false;
      }
    });
  }

  markMessagesAsRead() {
    this.contactService.markAsRead().subscribe({
      next: () => {
        console.log('Messages marked as read');
      },
      error: (err) => console.error('Error marking read', err)
    });
  }
}
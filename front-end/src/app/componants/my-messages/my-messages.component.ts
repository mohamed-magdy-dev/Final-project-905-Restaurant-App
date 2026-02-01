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
    // 1. تحميل الرسايل
    this.loadMessages();

    // 2. تصفير العداد (لأن اليوزر فتح الصفحة خلاص)
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
        // هنا ممكن نحتاج نحدث العداد في الناف بار، بس عشان السرعة 
        // اليوزر لما يعمل ريفريش او يروح صفحة تانية العداد هيختفي لوحده
      },
      error: (err) => console.error('Error marking read', err)
    });
  }
}
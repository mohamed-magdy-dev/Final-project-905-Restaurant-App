import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../service/contact.service'; 

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']
})
export class AdminMessagesComponent implements OnInit {

  messages: any[] = [];
  
  // صندوق الرد
  replyData = {
    id: null,
    adminReply: ''
  };

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.loadAllMessages();
  }

  loadAllMessages() {
    this.contactService.getAllMessages().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => console.error('Failed to load messages', err)
    });
  }

  openReplyModal(msg: any) {
    this.replyData.id = msg.id;
    this.replyData.adminReply = ''; 
  }

  submitReply() {
    if (!this.replyData.adminReply.trim()) return; 

    this.contactService.replyToMessage(this.replyData).subscribe({
      next: (res) => {
        alert('Reply sent successfully!');
        
        // قفل المودال (Button Click Simulation)
        const modalBtn = document.getElementById('closeModalBtn');
        if (modalBtn) modalBtn.click();
        
        // تحديث الجدول
        this.loadAllMessages();
      },
      error: (err) => {
        console.error('Reply failed', err);
        alert('Error sending reply');
      }
    });
  }
}
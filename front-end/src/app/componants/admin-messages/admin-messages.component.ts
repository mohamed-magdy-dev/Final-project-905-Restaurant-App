import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../service/contact.service'; 

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']
})
export class AdminMessagesComponent implements OnInit {

  messages: any[] = [];
  successMessage = ''; // success message variable
  errorMessage = '';   // EError message variable
  
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
        this.successMessage = 'Reply sent successfully!';
        
        // for modal to close automatically
        const modalBtn = document.getElementById('closeModalBtn');
        if (modalBtn) modalBtn.click();
        
        this.loadAllMessages();

        //timeout
        setTimeout(() => {
          this.successMessage = '';
        }, 4000);
      },
      error: (err) => {
        console.error('Reply failed', err);
        this.errorMessage = 'Error sending reply. Please try again.';
        
        // close modal (if error) so that it shows to the admin
        const modalBtn = document.getElementById('closeModalBtn');
        if (modalBtn) modalBtn.click();

        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    });
  }
}
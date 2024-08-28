import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

// Interface สำหรับข่าวแต่ละข่าว
interface NewsItem {
  id: number;
  name: string;
  detail: string;
  updatedDate: string;
  status: boolean;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  // กำหนดชนิดข้อมูลเป็น Array ของ NewsItem
  newsList: NewsItem[] = [];
  showPopup = false;

  // กำหนดชนิดข้อมูลให้ตรงกับ Interface
  selectedNews: NewsItem = { id: 0, name: '', detail: '', updatedDate: '', status: false };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getNews();
  }

  getNews() {
    this.http.get<NewsItem[]>('https://ba-sit.uapi.app/uapi/drt-ElectronicsDocument/ED-GetNews')
      .subscribe(data => {
        this.newsList = data;
      });
  }

  updateStatus(news: NewsItem) {
    const status = news.status ? 1 : 0;
    this.http.post('https://ba-sit.uapi.app/uapi/drt-ElectronicsDocument/ED-UpdateStatusNews', { id: news.id, status: status })
      .subscribe(response => {
        // อัปเดตสถานะเรียบร้อย
      });
  }

  viewNews(news: NewsItem) {
    this.selectedNews = { ...news };
    this.openPopup();
  }

  editNews(news: NewsItem) {
    // Logic สำหรับการแก้ไขข่าว
    this.viewNews(news);
  }

  deleteNews(id: number) {
    // Logic สำหรับการลบข่าว
    this.newsList = this.newsList.filter(news => news.id !== id);
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}

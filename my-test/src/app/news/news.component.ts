import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface ApiResponse<T> {
  successful: boolean;
  data: T;
}

export interface NewsItem {
  NewsId: number;
  NameNews: string;
  Detail: string;
  UpdatedDate: string;
  Status: boolean;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsList: NewsItem[] = [];
  showPopup = false;
  selectedNews: NewsItem = { NewsId: 0, NameNews: '', Detail: '', UpdatedDate: '', Status: false };
  popupTitle: string = 'รายละเอียดข่าวประชาสัมพันธ์';

  private newsApiUrl = 'https://ba-sit.uapi.app/uapi/drt-ElectronicsDocument/ED-GetNews';
  private updateStatusUrl = 'https://ba-sit.uapi.app/uapi/drt-ElectronicsDocument/ED-UpdateStatusNews';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getNews();
  }

  getNews() {
    this.http.get<ApiResponse<NewsItem[]>>(this.newsApiUrl)
      .pipe(
        catchError(err => {
          console.error('Failed to fetch news:', err);
          return of({ successful: false, data: [] });
        })
      )
      .subscribe(response => {
        console.log('API Response:', response);
        if (response.successful) {
          console.log('Received news data:', response.data);
          this.newsList = response.data;
        } else {
          console.error('Failed to fetch news: API response unsuccessful');
          this.newsList = [];
        }
      });
  }

  updateStatus(news: NewsItem) {
    const Status = news.Status ? 1 : 0;
    this.http.post(this.updateStatusUrl, { NewsId: news.NewsId, Status })
      .pipe(
        catchError(err => {
          console.error('Failed to update status:', err);
          return of(null);
        })
      )
      .subscribe(response => {
        console.log('Status updated successfully');
      });
  }

  addNews() {
    this.selectedNews = { NewsId: 0, NameNews: '', Detail: '', UpdatedDate: '', Status: false };
    this.popupTitle = 'รายละเอียดข่าวประชาสัมพันธ์';
    this.openPopup();
  }

  viewNews(news: NewsItem) {
    this.selectedNews = { ...news };
    this.popupTitle = 'รายละเอียดข่าวประชาสัมพันธ์';
    this.openPopup();
  }

  editNews(news: NewsItem) {
    this.viewNews(news);
  }

  deleteNews(NewsId: number) {
    this.newsList = this.newsList.filter(news => news.NewsId !== NewsId);
  }

  openPopup() {
    console.log('Opening popup...');
    this.showPopup = true;
  }
  
  closePopup() {
    console.log('Closing popup...');
    this.showPopup = false;
  }
}

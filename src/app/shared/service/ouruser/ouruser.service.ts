import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OuruserService {

  private apiUrl = 'http://localhost:8076/admin/get-all-moderators'; // URL de l'API Spring Boot

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer la liste des modérateurs
  getAllModerators(): Observable<any> {
    return this.http.get(this.apiUrl); // Effectuer une requête GET
  }
}

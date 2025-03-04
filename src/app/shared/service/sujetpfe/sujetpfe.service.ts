import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SujetPfe } from 'src/app/models/sujetpfe';
import { OurUsers } from 'src/app/models/users';

@Injectable({
  providedIn: 'root'
})
export class SujetPfeService {
  
  private baseUrl: string = 'http://localhost:8076/api/sujets';

  constructor(private http: HttpClient) { }

  // Ajouter un sujet
  ajouterSujet(sujetPfe: SujetPfe): Observable<SujetPfe> {
    return this.http.post<SujetPfe>(this.baseUrl, sujetPfe);
  }

  // Récupérer tous les sujets
  getAllSujets(): Observable<SujetPfe[]> {
    return this.http.get<SujetPfe[]>(this.baseUrl);
  }

  // Récupérer un sujet par ID
  getSujetById(id: number): Observable<SujetPfe> {
    return this.http.get<SujetPfe>(`${this.baseUrl}/${id}`);
  }

  // Modifier un sujet
  modifierSujet(id: number, updatedSujet: SujetPfe): Observable<SujetPfe> {
    return this.http.put<SujetPfe>(`${this.baseUrl}/${id}`, updatedSujet);
  }

  // Supprimer un sujet
  supprimerSujet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Affecter un modérateur à un sujet
  affecterModerateur(sujetPfeId: number, moderatorId: number): Observable<SujetPfe> {
    return this.http.put<SujetPfe>(`${this.baseUrl}/affecterModerateur/${sujetPfeId}/${moderatorId}`, {});
  }

  // Postuler pour un sujet
  postulerSujetPfe(sujetPfeId: number, userId: number): Observable<SujetPfe> {
    return this.http.post<SujetPfe>(`${this.baseUrl}/postuler/${sujetPfeId}/${userId}`, {});
  }

  // Accepter une postulation
  accepterPostulation(sujetPfeId: number, userId: number): Observable<SujetPfe> {
    return this.http.put<SujetPfe>(`${this.baseUrl}/accepter/${sujetPfeId}/${userId}`, {});
  }

  // Refuser une postulation
  refuserPostulation(sujetPfeId: number, userId: number): Observable<SujetPfe> {
    return this.http.put<SujetPfe>(`${this.baseUrl}/refuser/${sujetPfeId}/${userId}`, {});
  }

  // Récupérer les demandeurs pour un sujet
  getDemandeurs(sujetPfeId: number): Observable<OurUsers[]> {
    return this.http.get<OurUsers[]>(`${this.baseUrl}/demandeurs/${sujetPfeId}`);
  }

  getProjetsAffectes(userId: number): Observable<SujetPfe[]> {
    return this.http.get<SujetPfe[]>(`${this.baseUrl}/projets-affectes/${userId}`);
  }

  getProjetsPostules(userId: number): Observable<SujetPfe[]> {
    return this.http.get<SujetPfe[]>(`${this.baseUrl}/projets-postules/${userId}`);
  }

  getSujetsNonPostules(userId: number): Observable<SujetPfe[]> {
    return this.http.get<SujetPfe[]>(`${this.baseUrl}/sujets-non-postules/${userId}`);
  }
  
  uploadRapport(sujetPfeId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
  
    return this.http.post(`${this.baseUrl}/${sujetPfeId}/upload`, formData);
  }
  getSujetsByModerator(moderatorId: number): Observable<SujetPfe[]> {
    return this.http.get<SujetPfe[]>(`${this.baseUrl}/moderateur/${moderatorId}`);
  }
  
  
}

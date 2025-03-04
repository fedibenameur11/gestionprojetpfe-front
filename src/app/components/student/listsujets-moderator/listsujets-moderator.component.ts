import { Component, OnInit } from '@angular/core';
import { SujetPfe } from 'src/app/models/sujetpfe';
import { routes } from 'src/app/shared/service/routes/routes';
import { SujetPfeService } from 'src/app/shared/service/sujetpfe/sujetpfe.service';

@Component({
  selector: 'app-listsujets-moderator',
  templateUrl: './listsujets-moderator.component.html',
  styleUrl: './listsujets-moderator.component.scss' 
})
export class ListsujetsModeratorComponent implements OnInit{
  moderatorSujets: SujetPfe[] = []; // Stocke les sujets du modérateur
  selectedSujet: SujetPfe | null = null;
  moderatorId: number = 2; // À remplacer par l'ID réel du modérateur

  constructor(private sujetService : SujetPfeService){}
  ngOnInit(): void {
    this.getSujetsAffectesAuModerateur(this.moderatorId);
      
  }
  getSujetsAffectesAuModerateur(moderatorId: number) {
    this.sujetService.getSujetsByModerator(moderatorId).subscribe((data) => {
        this.moderatorSujets = data;
    });
}
  ouvrirDetails(sujet: SujetPfe) {
    this.selectedSujet = sujet;
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable, PartialObserver, Subscription, concat } from 'rxjs';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  loading = false;
  // pokemons: any[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    // this.getPokemons();
    this.loadMore();
  }

  get pokemons(): any[] {
    return this.pokemonService.pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  // getPokemons() {
  //   this.pokemonService.getPokemons().subscribe((data: any) => {
  //     console.log(data.results)
  //     this.pokemons = data.results;
  //   })
  // }

  getTypes(pokemon: any): string {
    return this.pokemonService.getType(pokemon);
  }

  loadMore(): void {
    this.loading = true;
    this.subscription = this.pokemonService.getNext().subscribe(
      (response:any) => {
        this.pokemonService.next = response.next;
        const details = response.results.map((pokemon: any) => this.pokemonService.get(pokemon.name));
        this.subscription = concat(...details).subscribe((response: any) => {
          this.pokemonService.pokemons.push(response);
        });
      }, 
      (err) => {
        console.log('error', err)
      }, 
      () => {
        this.loading = false;
      }
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }
}

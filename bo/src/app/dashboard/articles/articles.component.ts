import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/services';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
})
export class ArticlesComponent {
  menu_items: any[] = [];
  items: any[] = [];

  constructor(
    protected generalService: GeneralService,
    private router: Router
  ) {
    /* ------------------------------ default items ------------------------------ */
    this.menu_items = [
      {
        label: 'Liste des articles',
        icon: 'pi pi-fw pi-book',
        route: '/articles/liste_articles',
      },
    ];
  }

  ngOnInit() {
    this.initMenuItems();
  }

  initMenuItems() {
    /* -------------------------- set index automatically ----------------------- */
    setTimeout(() => {
      this.menu_items = this.menu_items.map((res: any, index: number) => {
        return {
          ...res,
          command: (e: any) => {
            this.router.navigate([e?.item?.route]);
            this.items = [{ label: e?.item?.label, link: this.router.url }];
            this.InitSelected(index);
          },
        };
      });
      this.getCurrentmenu();
    }, 150);
  }

  getCurrentmenu() {
    const routeMap = {};
    this.menu_items.forEach((res) => {
      routeMap[res.route] = res?.label;
    });
    const route = this.router.url;
    const label = routeMap[route] || 'Liste des articles';
    this.items = [{ label, link: route }];
    this.InitSelected(
      this.menu_items.findIndex((item: any) => item?.route == route)
    );
  }

  InitSelected(curent: any) {
    let menu: any = document.getElementById('menu_bar');
    setTimeout(() => {
      let list: any = menu.children[0]?.children[1]?.children[0]?.children;
      /* -------------------------------- Le reset -------------------------------- */
      new Promise((resolve) => {
        resolve(Array.from(this.menu_items.keys()));
      }).then((data: any[]) => {
        setTimeout(() => {
          data.forEach((key) => {
            let element: any = list?.item(key);
            element?.children[0]?.classList.add('p-light');
            element?.children[0]?.classList.remove('p-dark');
          });
        }, 100);
        setTimeout(() => {
          /* -------------------------------- Selection ------------------------------- */
          let element: any = list?.item(curent);
          element?.children[0]?.classList.add('p-dark');
          element?.children[0]?.classList.remove('p-light');
        }, 100);
      });
    }, 100);
  }

  onItemClick(event: any) {
    if (event?.item) {
      if (event?.item?.routerLink && event?.item?.routerLink == '/accueil') {
        this.generalService.is_loading = true;
        this.router.navigate([event?.item?.routerLink]).then(() => {
          setTimeout(() => {
            this.generalService.currentMenu = '/accueil';
            let element: any = document.getElementById('/accueil');
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'end',
              });
            }
            this.generalService.is_loading = false;
          }, 1000);
        });
      }
    }
  }
}

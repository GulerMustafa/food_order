import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  concatMap,
  delay,
  finalize,
  flatMap,
  forkJoin,
  from,
  interval,
  merge,
  mergeMap,
  Observable,
  of,
  take,
  throwError,
} from 'rxjs';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  orderInfo = [
    {
      title: 'toppings',
      items: [
        { name: 'marul', selected: false, amount: 5, disabled: false },
        { name: 'tursu', selected: false, amount: 5, disabled: false },
        { name: 'domates', selected: false, amount: 5, disabled: false },
        { name: 'sogan', selected: false, amount: 5, disabled: false },
        { name: 'ekmek', selected: true, amount: 5, disabled: true },
      ],
    },
    {
      title: 'burger',
      items: [
        { name: 'kofte', selected: false, amount: 5, disabled: false },
        { name: 'tavuk', selected: false, amount: 5, disabled: false },
      ],
    },
    {
      title: 'sideItems',
      items: [
        { name: 'paket_sos', selected: false, amount: 5, disabled: false },

        { name: 'patates', selected: false, amount: 5, disabled: false },
        { name: 'cola', selected: false, amount: 5, disabled: false },
      ],
    },
  ];
  burgerRarity: 'rare' | 'medium' | 'well' = 'medium';
  burgerSelection: string = '';

  selectedToppings: any[] = [];
  selectedBurger: any[] = [];
  selectedSideItems: any[] = [];

  menuServed: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: duration,
    });
  }

  burgerSelectionChange(parentItem: any, subItemIndex: number) {
    if (parentItem.title === 'burger') {
      const burgerArr = this.orderInfo.find((x) => x.title === 'burger');
      burgerArr?.items.map((x, i) => {
        if (i !== subItemIndex) {
          x.selected = false;
        }
        if (x.selected) {
          this.burgerSelection = x.name;
        } else if (!x.selected && i === subItemIndex) {
          this.burgerSelection = '';
        }
      });
    }
  }

  clearSelections() {
    this.selectedToppings = [];
    this.selectedBurger = [];
    this.selectedSideItems = [];
  }

  step1(time: number) {
    this.clearSelections();
    this.openSnackBar('Step 1 start', time);
    from(this.orderInfo)
      .pipe(
        delay(time),
        finalize(() => this.step2(3000))
      )
      .subscribe((resp) => {
        resp.items.forEach((x) => {
          if (x.selected) {
            if (resp.title === 'toppings') {
              this.selectedToppings.push(x.name);
            } else if (resp.title === 'burger') {
              this.selectedBurger.push(x.name);
            } else if (resp.title === 'sideItems') {
              this.selectedSideItems.push(x.name);
            }
          }
        });
      });
  }
  step2(time: number) {
    let err: boolean = false;
    this.openSnackBar('Step 2 started', time);
    of(this.orderInfo)
      .pipe(delay(time))
      .subscribe((resp) => {
        resp.forEach((item) => {
          item.items.map((x) =>
            x.selected
              ? x.amount === 5
                ? (x.amount -= 1)
                : (err = true)
              : null
          );
        });

        if (err) {
          alert('Count of items must be 5');
        } else {
          const joinedObservables = forkJoin([
            this.step3(),
            this.step4(),
            this.step5(),
          ]);

          this.openSnackBar('Step 3,4 and 5 started', 4000);
          joinedObservables.pipe(finalize(() => this.step6())).subscribe();
        }
      });
  }

  step3() {
    if (this.burgerSelection === 'kofte') {
      if (this.burgerRarity === 'rare') {
        return of(null).pipe(
          delay(2000),
          mergeMap(() => of(null).pipe(delay(2000)))
        );
      } else if (this.burgerRarity === 'medium') {
        return of(null).pipe(
          delay(3000),
          mergeMap(() => of(null).pipe(delay(2000)))
        );
      } else {
        return of(null).pipe(
          delay(4000),
          mergeMap(() => of(null).pipe(delay(2000)))
        );
      }
    } else {
      return of(null).pipe(
        delay(3000),
        mergeMap(() => of(null).pipe(delay(2000)))
      );
    }
  }
  step4(time: number = 5000) {
    if (this.selectedSideItems.includes('patates')) {
      return of(null).pipe(delay(time));
    } else {
      return of(null);
    }
  }
  step5(time: number = 2000) {
    if (this.selectedSideItems.includes('cola')) {
      return of(null).pipe(delay(time));
    } else {
      return of(null);
    }
  }

  step6(time: number = 1000) {
    this.openSnackBar('Step 6 started', time);
    of(null)
      .pipe(
        delay(time),
        finalize(() => this.step7())
      )
      .subscribe();
  }

  step7(time: number = 1000) {
    this.openSnackBar('Serving Customer (Step 7)', time);

    of(null)
      .pipe(delay(time))
      .subscribe((resp) => {
        this.menuServed = true;
        this.burgerSelection = '';
        this.orderInfo.forEach((item) => {
          item.items.map((x) =>
            x.name !== 'ekmek' ? (x.selected = false) : null
          );
        });
      });
  }
}

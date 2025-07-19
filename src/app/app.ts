import { Component, signal , AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements AfterViewInit {
  protected readonly title = signal('pig-calculator');

  ngAfterViewInit(): void {
    calculate();
  }
}
export function calculate(): void {

    const price3Input = document.getElementById('price3') as HTMLInputElement;
    const half3Input = document.getElementById('half3') as HTMLInputElement;

    const price3 = parseFloat(price3Input.value);
    const half3 = parseFloat(half3Input.value);

    // If price3 is not 0, set half3 readonly, else remove readonly
    if (price3 !== 0) {
        half3Input.readOnly = true;
    } else {
        half3Input.readOnly = false;
    }

    // If half3 is not 0, set price3 readonly, else remove readonly
    if (half3 !== 0) {
        price3Input.readOnly = true;
    } else {
        price3Input.readOnly = false;
    }

    const weights = [
        parseFloat((document.getElementById('weight1') as HTMLInputElement).value),
        parseFloat((document.getElementById('weight2') as HTMLInputElement).value),
        parseFloat((document.getElementById('weight3') as HTMLInputElement).value)
    ];
    const prices = [
        parseFloat((document.getElementById('price1') as HTMLInputElement).value),
        parseFloat((document.getElementById('half2') as HTMLInputElement).value),
        parseFloat((document.getElementById('price3') as HTMLInputElement).value)
    ];
    if (half3 !== 0) {
        prices[2] = half3;
    }

    const remains = weights.map(w => (w * 0.92).toFixed(1));
    const losses = weights.map((w, i) => (w - parseFloat(remains[i])).toFixed(1));

    (document.getElementById('remain1') as HTMLElement).innerText = remains[0];
    (document.getElementById('remain2') as HTMLElement).innerText = remains[1];
    (document.getElementById('remain3') as HTMLElement).innerText = remains[2];
    (document.getElementById('loss1') as HTMLElement).innerText = losses[0];
    (document.getElementById('loss2') as HTMLElement).innerText = losses[1];
    (document.getElementById('loss3') as HTMLElement).innerText = losses[2];

    const lossCost1 = (parseFloat(losses[0]) * prices[0]).toFixed(2);
    const lossCost2 = (parseFloat(losses[1]) * prices[1]).toFixed(2);
    const lossCost3 = (parseFloat(losses[2]) * prices[2]).toFixed(2);
    (document.getElementById('lossCost1') as HTMLElement).innerText = lossCost1;
    (document.getElementById('lossCost2') as HTMLElement).innerText = lossCost2;
    (document.getElementById('lossCost3') as HTMLElement).innerText = lossCost3;

    const hidden1 = ['ice1','slaughter1','trim1','transport1','worker1','other1']
        .reduce((sum, id) => sum + parseFloat((document.getElementById(id) as HTMLInputElement).value || '0'), 0)
        + parseFloat(lossCost1);
    const hidden2 = ['ice2','slaughter2','trim2','transport2','worker2','other2']
        .reduce((sum, id) => sum + parseFloat((document.getElementById(id) as HTMLInputElement).value || '0'), 0)
        + parseFloat(lossCost2);
    const hidden3 = ['ice3','slaughter3','trim3','transport3','worker3','other3']
        .reduce((sum, id) => sum + parseFloat((document.getElementById(id) as HTMLInputElement).value || '0'), 0)
        + parseFloat(lossCost3);

    (document.getElementById('totalHidden1') as HTMLElement).innerText = hidden1.toFixed(2);
    (document.getElementById('totalHidden2') as HTMLElement).innerText = hidden2.toFixed(2);
    (document.getElementById('totalHidden3') as HTMLElement).innerText = hidden3.toFixed(2);

    const pigCost1 = (weights[0] * prices[0]).toFixed(2);
    const pigCost2 = (weights[1] * prices[1]).toFixed(2);
    const pigCost3 = (weights[2] * prices[2]).toFixed(2);
    (document.getElementById('pigCost1') as HTMLElement).innerText = pigCost1;
    (document.getElementById('pigCost2') as HTMLElement).innerText = pigCost2;
    (document.getElementById('pigCost3') as HTMLElement).innerText = pigCost3;

    (document.getElementById('hiddenCost1') as HTMLElement).innerText = hidden1.toFixed(2);
    (document.getElementById('hiddenCost2') as HTMLElement).innerText = hidden2.toFixed(2);
    (document.getElementById('hiddenCost3') as HTMLElement).innerText = hidden3.toFixed(2);

    (document.getElementById('totalCost1') as HTMLElement).innerText = (parseFloat(pigCost1) + hidden1).toFixed(2);
    (document.getElementById('totalCost2') as HTMLElement).innerText = (parseFloat(pigCost2) + hidden2).toFixed(2);
    (document.getElementById('totalCost3') as HTMLElement).innerText = (parseFloat(pigCost3) + hidden3).toFixed(2);
}
(window as any).calculate = calculate;
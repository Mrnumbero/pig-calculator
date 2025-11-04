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

export function formatNumberWithComma(value: string | number): string {
  const number = parseFloat(value.toString().replace(/,/g, ""));
  return isNaN(number) ? "" : number.toLocaleString("th-TH",{
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatInput(input: HTMLInputElement): void {
  const value = parseFloat(input.value.replace(/,/g, ''));
  if (!isNaN(value)) {
    input.value = value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

export function unformatInput(input: HTMLInputElement): void {
  input.value = input.value.replace(/,/g, '');
}


export function calculate(): void {
    // const price3Input = document.getElementById('price3') as HTMLInputElement;
    // const half3Input = document.getElementById('half3') as HTMLInputElement;

    // const price3 = parseFloat(price3Input.value);
    // const half3 = parseFloat(half3Input.value);

    // const weightcp3Input = document.getElementById('weightcp3') as HTMLInputElement;
    // const weightcp3 = parseFloat(weightcp3Input.value);

    // If weightcp3 or half3 is filled, calculate column 3 like CP
    const lossPercentBox = document.getElementById('lossPercentBox') as HTMLInputElement;
    const lossPercent = lossPercentBox ? parseFloat(lossPercentBox.value) : 8;
    const remainPercent = 100 - lossPercent;

    (document.getElementById('lossPercentText') as HTMLElement).innerText = `${lossPercent}%`;
    (document.getElementById('remainPercentText') as HTMLElement).innerText = `${remainPercent}%`;

    let weights = [
        parseFloat((document.getElementById('weight1') as HTMLInputElement).value),
        parseFloat((document.getElementById('weightcp2') as HTMLInputElement).value),
        // parseFloat((document.getElementById('weight3') as HTMLInputElement).value)
    ];
    let prices = [
        parseFloat((document.getElementById('price1') as HTMLInputElement).value),
        parseFloat((document.getElementById('half2') as HTMLInputElement).value),
        // parseFloat((document.getElementById('price3') as HTMLInputElement).value)
    ];

    // Override weights[2] and prices[2] if weightcp3 or half3 is filled
    // if (weightcp3 !== 0 || half3 !== 0) {
    //     weights[2] = weightcp3;
    //     prices[2] = half3;
    // }

    const remains = weights.map(w => parseFloat((w * (remainPercent / 100)).toFixed(1)));
    const losses = weights.map((w, i) => parseFloat((w - remains[i]).toFixed(1)));
    (document.getElementById('remain1') as HTMLElement).innerText = formatNumberWithComma(remains[0].toFixed(1));

    // Now remain2 will always match weightcp2
    (document.getElementById('remain2') as HTMLElement).innerText = formatNumberWithComma(weights[1].toFixed(1));
    // (document.getElementById('remain3') as HTMLElement).innerText = weightcp3 !== 0 ? weights[2].toString() : remains[2];
    (document.getElementById('loss1') as HTMLElement).innerText = formatNumberWithComma(losses[0].toFixed(1));
    (document.getElementById('loss2') as HTMLElement).innerText = '0';    // (document.getElementById('loss3') as HTMLElement).innerText = weightcp3 !== 0 ? '0' : losses[2];

    const lossCost1 = parseFloat((losses[0] * prices[0]).toFixed(2));
    const lossCost2 = 0;
    (document.getElementById('lossCost1') as HTMLElement).innerText = formatNumberWithComma(lossCost1.toFixed(2));
    (document.getElementById('lossCost2') as HTMLElement).innerText = formatNumberWithComma(lossCost2.toFixed(2));
    // (document.getElementById('lossCost3') as HTMLElement).innerText = lossCost3;

    const hidden1 = ['ice1','slaughter1','trim1','transport1','worker1','other1']
        .reduce((sum, id) => sum + parseFloat((document.getElementById(id) as HTMLInputElement).value || '0'), 0);
    const hidden2 = ['ice2','slaughter2','trim2','transport2','worker2','other2']
        .reduce((sum, id) => sum + parseFloat((document.getElementById(id) as HTMLInputElement).value || '0'), 0);

    // const hidden3 = ['ice3','slaughter3','trim3','transport3','worker3','other3']
    //     .reduce((sum, id) => sum + parseFloat((document.getElementById(id) as HTMLInputElement).value || '0'), 0);

    (document.getElementById('totalHidden1') as HTMLElement).innerText = formatNumberWithComma(hidden1.toFixed(2));
    (document.getElementById('totalHidden2') as HTMLElement).innerText = formatNumberWithComma(hidden2.toFixed(2));
    // (document.getElementById('totalHidden3') as HTMLElement).innerText = hidden3.toFixed(2);

    const pigCost1 = parseFloat((weights[0] * prices[0]).toFixed(2));
    const pigCost2 = parseFloat((weights[1] * prices[1]).toFixed(2));


    // const pigCost3 = weightcp3 !== 0 ? (weights[2] * prices[2] * 0.92).toFixed(2) : (weights[2] * prices[2]).toFixed(2);
    (document.getElementById('pigCost1') as HTMLElement).innerText = formatNumberWithComma(pigCost1.toFixed(2));
    (document.getElementById('pigCost2') as HTMLElement).innerText = formatNumberWithComma(pigCost2.toFixed(2));
    // (document.getElementById('pigCost3') as HTMLElement).innerText = pigCost3;

    (document.getElementById('hiddenCost1') as HTMLElement).innerText = formatNumberWithComma(hidden1.toFixed(2));
    (document.getElementById('hiddenCost2') as HTMLElement).innerText = formatNumberWithComma(hidden2.toFixed(2));
    // (document.getElementById('hiddenCost3') as HTMLElement).innerText = hidden3.toFixed(2);

    const totalCost1 = pigCost1 + hidden1;
    const totalCost2 = pigCost2 + hidden2;

    (document.getElementById('totalCost1') as HTMLElement).innerText = formatNumberWithComma(totalCost1.toFixed(2));
    (document.getElementById('totalCost2') as HTMLElement).innerText = formatNumberWithComma(totalCost2.toFixed(2));
    // (document.getElementById('totalCost3') as HTMLElement).innerText = (parseFloat(pigCost3) + hidden3).toFixed(2);

    const fillprice = parseFloat((document.getElementById('fillprice') as HTMLInputElement).value) || 0;
    const pigPrice1 = remains[0] * fillprice;
    const pigPrice2 = weights[1] * fillprice;


    (document.getElementById('pigPrice1') as HTMLElement).innerText = formatNumberWithComma(pigPrice1);
    (document.getElementById('pigPrice2') as HTMLElement).innerText = formatNumberWithComma(pigPrice2);
    (document.getElementById('totalCost3') as HTMLElement).innerText = formatNumberWithComma(totalCost1.toFixed(2));
    (document.getElementById('totalCost4') as HTMLElement).innerText = formatNumberWithComma(totalCost2.toFixed(2));

    const pigProfit1 = pigPrice1 - totalCost1;
    const pigProfit2 = pigPrice2 - totalCost2;
    (document.getElementById('pigProfit1') as HTMLElement).innerText = formatNumberWithComma(pigProfit1.toFixed(2));
    (document.getElementById('pigProfit2') as HTMLElement).innerText = formatNumberWithComma(pigProfit2.toFixed(2));

    const pigProfitPerKg1 = pigProfit1 / weights[0];
    const pigProfitPerKg2 = pigProfit2 / weights[1];
    (document.getElementById('pigProfitPerKg1') as HTMLElement).innerText = formatNumberWithComma(pigProfitPerKg1.toFixed(2));
    (document.getElementById('pigProfitPerKg2') as HTMLElement).innerText = formatNumberWithComma(pigProfitPerKg2.toFixed(2));
  
}
(window as any).calculate = calculate;  
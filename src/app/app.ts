import { Component, signal, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CvService } from './service/cv.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements AfterViewInit {
  title = signal('pig-calculator');

  cvCode = '';
  salesId = '';
  loading = false;
  message = '';
  status = '';

  constructor(private cvService: CvService) {}

  async ngAfterViewInit() {
    // Test Firebase connection once UI is ready
    try {
      await this.cvService.testConnection();
      this.status = '✅ Firebase connected';
    } catch (e: any) {
      console.error(e);
      this.status =
        '❌ Firebase connection failed: ' + (e?.message || 'check config / rules');
    }

    // initial calculate
    calculate();
  }

  // require an explicit userInitiated flag to actually save to Firebase
  async submit(userInitiated = false) {
    // always calculate first
    calculate();

    const code = this.cvCode?.trim();
    const sales = this.salesId?.trim();

    // if submit wasn't triggered by the user (e.g. reload/programmatic call), do NOT save
    if (!userInitiated) {
      this.message =
        '✅ คำนวณเรียบร้อยแล้ว (ยังไม่ได้บันทึก: กดปุ่มเพื่อบันทึก)';
      return;
    }

    // if either field missing, do not attempt to save to Firebase
    if (!code || !sales) {
      this.message =
        '✅ คำนวณเรียบร้อยแล้ว (ยังไม่ได้บันทึก: กรุณากรอก CV Code และ Sales ID หากต้องการบันทึกการใช้งาน)';
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      await this.cvService.saveCv(code, sales);
      this.message = '✅ คำนวณและบันทึกเรียบร้อยแล้ว';
      this.cvCode = '';
      this.salesId = '';
    } catch (e: any) {
      console.error(e);
      this.message =
        '❌ บันทึกไม่สำเร็จ: ' + (e?.message || 'ตรวจสอบ Firebase อีกครั้ง');
    } finally {
      this.loading = false;
    }
  }
}

/* ---- helper + calculator, still DOM-based but wired as global for template ---- */

export function formatNumberWithComma(value: string | number): string {
  const number = parseFloat(value.toString().replace(/,/g, ''));
  return isNaN(number)
    ? ''
    : number.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

export function calculate(): void {
  const lossPercentBox = document.getElementById('lossPercentBox') as HTMLInputElement;
  const lossPercent = lossPercentBox
    ? parseFloat(lossPercentBox.value || '8')
    : 8;
  const remainPercent = 100 - lossPercent;

  (document.getElementById('lossPercentText') as HTMLElement).innerText = `${lossPercent}%`;
  (document.getElementById('remainPercentText') as HTMLElement).innerText = `${remainPercent}%`;

  const weight1 = parseFloat((document.getElementById('weight1') as HTMLInputElement)?.value || '0');
  const weightcp2 = parseFloat((document.getElementById('weightcp2') as HTMLInputElement)?.value || '0');
  const price1 = parseFloat((document.getElementById('price1') as HTMLInputElement)?.value || '0');
  const half2 = parseFloat((document.getElementById('half2') as HTMLInputElement)?.value || '0');

  const weights = [weight1, weightcp2];
  const prices = [price1, half2];

  const remains = weights.map(w => parseFloat((w * (remainPercent / 100)).toFixed(1)));
  const losses = weights.map((w, i) => parseFloat((w - remains[i]).toFixed(1)));

  (document.getElementById('remain1') as HTMLElement).innerText = formatNumberWithComma(remains[0].toFixed(1));
  (document.getElementById('remain2') as HTMLElement).innerText = formatNumberWithComma(weights[1].toFixed(1));
  (document.getElementById('loss1') as HTMLElement).innerText = formatNumberWithComma(losses[0].toFixed(1));
  (document.getElementById('loss2') as HTMLElement).innerText = '0';

  const lossCost1 = parseFloat((losses[0] * prices[0]).toFixed(2));
  const lossCost2 = 0;

  (document.getElementById('lossCost1') as HTMLElement).innerText = formatNumberWithComma(lossCost1.toFixed(2));
  (document.getElementById('lossCost2') as HTMLElement).innerText = formatNumberWithComma(lossCost2.toFixed(2));

  const hidden1 = ['ice1','slaughter1','trim1','transport1','worker1','other1']
    .reduce((sum, id) => sum + parseFloat(((document.getElementById(id) as HTMLInputElement)?.value || '0')), 0);
  const hidden2 = ['ice2','slaughter2','trim2','transport2','worker2','other2']
    .reduce((sum, id) => sum + parseFloat(((document.getElementById(id) as HTMLInputElement)?.value || '0')), 0);

  (document.getElementById('totalHidden1') as HTMLElement).innerText = formatNumberWithComma(hidden1.toFixed(2));
  (document.getElementById('totalHidden2') as HTMLElement).innerText = formatNumberWithComma(hidden2.toFixed(2));

  const pigCost1 = parseFloat((weights[0] * prices[0]).toFixed(2));
  const pigCost2 = parseFloat((weights[1] * prices[1]).toFixed(2));

  (document.getElementById('pigCost1') as HTMLElement).innerText = formatNumberWithComma(pigCost1.toFixed(2));
  (document.getElementById('pigCost2') as HTMLElement).innerText = formatNumberWithComma(pigCost2.toFixed(2));

  (document.getElementById('hiddenCost1') as HTMLElement).innerText = formatNumberWithComma(hidden1.toFixed(2));
  (document.getElementById('hiddenCost2') as HTMLElement).innerText = formatNumberWithComma(hidden2.toFixed(2));

  const totalCost1 = pigCost1 + hidden1;
  const totalCost2 = pigCost2 + hidden2;

  (document.getElementById('totalCost1') as HTMLElement).innerText = formatNumberWithComma(totalCost1.toFixed(2));
  (document.getElementById('totalCost2') as HTMLElement).innerText = formatNumberWithComma(totalCost2.toFixed(2));

  const fillprice = parseFloat((document.getElementById('fillprice') as HTMLInputElement)?.value || '0');

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

  const pigProfitPerKg1 = weights[0] ? pigProfit1 / weights[0] : 0;
  const pigProfitPerKg2 = weights[1] ? pigProfit2 / weights[1] : 0;

  (document.getElementById('pigProfitPerKg1') as HTMLElement).innerText =
    formatNumberWithComma(pigProfitPerKg1.toFixed(2));
  (document.getElementById('pigProfitPerKg2') as HTMLElement).innerText =
    formatNumberWithComma(pigProfitPerKg2.toFixed(2));
}

// expose for inline oninput="calculate()"
(window as any).calculate = calculate;

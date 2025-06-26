import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { CrypteService } from '../crypte/crypte.service';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import { jwtDecode } from 'jwt-decode';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Injectable({
  providedIn: 'root',
})
/* ------------------- jwt_generated_token est le jwt jwt_generated_token ------------------- */
export class GeneralService {
  public if_load: boolean = true;
  public is_loading: boolean = false;
  public currentMenu: any;
  public innerWidth: any = window.innerWidth; // StoreService.innerWidth>=992 (web) // StoreService.innerWidth<992 (mobile)
  public menu_toggel: boolean = true;
  public Editor = ClassicEditor;
  public config = {
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      'blockQuote',
      '|',
      'undo',
      'redo',
    ],
  };
  constructor(private CryprtService: CrypteService, private router: Router) {}

  removeEmptyTags(editorContent: any) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorContent, 'text/html');
    // Query all <span> and <p> elements
    doc.querySelectorAll('span, p').forEach((el) => {
      // Check if the element is a 'p' tag with only a 'br' tag inside
      if (el.tagName.toLowerCase() === 'p' && el.innerHTML.trim() === '<br>') {
        el.remove();
      }
      // Check if the element is otherwise empty (ignoring whitespace)
      else if (!el.innerHTML.trim()) {
        el.remove();
      }
      // If the element is a <p>, replace it with <span>
      else if (el.tagName.toLowerCase() === 'p') {
        // Create a new <span> element
        const span = document.createElement('span');
        // Copy all attributes from <p> to <span>
        Array.from(el.attributes).forEach((attr) => {
          span.setAttribute(attr.name, attr.value);
        });
        // Move all children of <p> to <span>
        while (el.firstChild) {
          span.appendChild(el.firstChild);
        }
        // Replace <p> with <span> in the DOM
        el.parentNode.replaceChild(span, el);
      }
    });
    // Return only the innerHTML of the <body> tag
    return doc.body.innerHTML;
  }

  /* -------------------------------------------------------------------------- */
  /*                     Fonction de l'exportation en excel                     */
  /* -------------------------------------------------------------------------- */
  exportAsExcelFile(
    jsonData: any[],
    excelFileName: string,
    taille: any = 40
  ): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    // Add a worksheet
    const worksheet = workbook.addWorksheet('Feuille 1');
    // Define the header row
    const header = Object.keys(jsonData[0]);
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCFFE5' },
        bgColor: { argb: 'FFFFD700' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    // Add data rows
    jsonData.forEach((data) => {
      const row = Object.values(data);
      worksheet.addRow(row);
    });
    // Assuming 'worksheet' is already defined and 'headers' contains your column headers
    header.forEach((_, index) => {
      const columnIndex = index + 1; // ExcelJS columns are 1-based
      worksheet.getColumn(columnIndex).width = taille;
    });
    // Generate and save the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(blob, excelFileName + '.xlsx');
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                      Fonction de l'exportation en csv                      */
  /* -------------------------------------------------------------------------- */
  exportAsCsvFile(items: any[], file_name: any, separateur: any = ',') {
    const header = Object.keys(items[0]);
    const headerString = header.join(separateur);
    const replacer = (key: any, value: any) => value ?? '';
    const rowItems = items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(separateur)
    );
    const csv = [headerString, ...rowItems].join('\r\n');
    const data: Blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8',
    });
    FileSaver.saveAs(data, file_name + '.csv');
  }

  Speak(message: any) {
    if (this.get_data_from_session_decrypted('if_has_sound') == 'true') {
      let synth = window.speechSynthesis;
      let utterance = new SpeechSynthesisUtterance();
      utterance.text = message;
      utterance.lang = 'fr-FR';
      utterance.voice = synth.getVoices().filter(function (voice) {
        return voice.name == 'Google français';
      })[0];
      synth.speak(utterance);
    }
  }

  isJson(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  If_Dictionnary_has_Same_Structure(arr: any[]) {
    if (arr.length > 0) {
      // Get the keys of the first object in the array
      let keys: any[] = ['icon', 'title', 'routerLink'];
      // Check if the other objects in the array have the same keys and types
      for (var i = 1; i < arr.length; i++) {
        if (keys.length !== Object.keys(arr[i]).length) {
          return false; // The objects have different number of properties
        }
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          if (typeof arr[i][key] !== typeof arr[0][key]) {
            return false; // The property has a different data type
          }
        }
      }
      return true; // All objects have the same structure
    } else {
      return false;
    }
  }

  /* --------------- Récupération d'une valeur depuis une liste --------------- */
  Get_libelle(identifiant: any = null, liste: any[] = [], prop: any = 'label') {
    if (identifiant && liste.length > 0) {
      return liste.find(
        (element: any) => Number(element?.value) == Number(identifiant)
      )?.[prop];
    } else {
      return null;
    }
  }

  syntaxHighlight(value: any) {
    return JSON.stringify(value, null, 4)
      .replace(/ /g, '&nbsp;') // note the usage of `/ /g` instead of `' '` in order to replace all occurences
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        }
      )
      .replace(/\n/g, '<br/>');
  }

  /* -------------------------------------------------------------------------- */
  /*                           Gestion du localStorage                          */
  /* -------------------------------------------------------------------------- */
  get_array_access_from_storage(key_name: any): any[] {
    let value: any = localStorage.getItem(key_name);
    if (value && this.isJson(value)) {
      let value_parsed: any = JSON.parse(value);
      if (Array.isArray(value_parsed)) {
        return value_parsed;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  set_data_to_session_crypted(body: any) {
    body.forEach((element: any) => {
      if (
        element?.key &&
        element?.key != null &&
        element?.key != '' &&
        element?.value != '' &&
        element?.value != null &&
        element?.value
      ) {
        localStorage.setItem(
          element?.key,
          this.CryprtService.encryptUsingAES256(element?.value).toString()
        );
      }
    });
    return true;
  }

  get_data_from_session_decrypted(key: any): any {
    /* ------------------ Si la variable existe sur la session ------------------ */
    if (localStorage.getItem(key)) {
      let result: any = this.CryprtService.decryptUsingAES256(
        localStorage.getItem(key)
      );
      if (result != null) {
        return result != null ? result : null;
      }
    } else {
      if (key == 'id_user') {
        localStorage.clear();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 100);
      }
      return null;
    }
  }

  /* ----------------------- Fonction pour décode le jwt ---------------------- */
  Get_claim(claim: any) {
    let result: any = jwtDecode(
      this.get_data_from_session_decrypted('jwt_generated_token')
    );
    return result?.[claim];
  }

  DecodeJwt(jwt_generated_token: any, claim: any) {
    let result: any = jwtDecode(jwt_generated_token);
    return result?.[claim];
  }

  GotoTop() {
    setTimeout(() => {
      let element: any = document.getElementById('top_bar_html');
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end',
      });
    }, 100);
  }

  /* -------------------------------------------------------------------------- */
  /*                           la gestion des erreurs                           */
  /* -------------------------------------------------------------------------- */
  errorSwal(
    message: any,
    duration: any = 2000,
    icon: any = 'error',
    text: any = null,
    showConfirmButton: boolean = false
  ) {
    Swal.fire({
      icon: icon,
      title: message,
      text: text,
      showConfirmButton: showConfirmButton,
      timer: duration,
    });
  }

  /* -------------------------- optimized sweetAlert -------------------------- */
  sweetAlert(title: string = null, message: string = null, icon = null) {
    return Swal.fire({
      title: title,
      text: message !== null ? message : '',
      icon: icon,
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#258662',
      cancelButtonColor: '#f50707',
      confirmButtonText: 'Valider',
    });
  }
  timer(timerDefault: any, icon: any) {
    if (timerDefault == 'noTime') {
      return 0;
    }
    if ((timerDefault == null || timerDefault == 1) && icon != 'error') {
      return 2500;
    }
    if (timerDefault == 2 || icon == 'error') {
      return 3500;
    }
    if (timerDefault == 3) {
      return 5000;
    }
  }
  sweetAlert2(
    title?: any,
    message?: any,
    type?: any,
    icon?: any,
    timerDefault?: any,
    speak?: number
  ) {
    // set timer on (1 | null) for 2500 or '2' => 3500 or '3' => 5000
    const timer = this.timer(timerDefault, icon);
    let result = null;
    if (type == 'confirm') {
      result = Swal.fire({
        title: title,
        text: message !== null ? message : '',
        icon: icon,
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Valider',
        confirmButtonColor: '#258662',
        cancelButtonColor: '#f50707',
      });
    }
    if (type == 'simple') {
      result = Swal.fire({
        title: title,
        text: message !== null ? message : '',
        icon: icon,
        timer: timer,
        showConfirmButton: !timer,
        confirmButtonColor: '#258662',
        confirmButtonText: 'Ok',
      });
    }
    if (type == 'none-dissmis') {
      result = Swal.fire({
        title: title,
        text: message !== null ? message : '',
        icon: icon,
        showConfirmButton: false,
        showCancelButton: false, // Hide the cancel button
        allowOutsideClick: false, // Disable clicks outside the modal
        allowEscapeKey: false, // Disable the escape key
        allowEnterKey: false, // Disable the enter key
        timer: timer,
      });
    }
    if (
      speak &&
      Number(this.get_data_from_session_decrypted('speech_synthesis'))
    ) {
      this.Speak(message);
    }
    return result;
  }

  /* ---- Fonction pour Vérifier si un intervalle de deux dates est valide ---- */
  CheckIfDateValid(debut: any, fin: any) {
    let start = new Date(debut);
    let end = new Date(fin);
    let diff = end.valueOf() - start.valueOf();
    // la methode valueOf appliquée à une date retourne une valeur en millisecondes écoulées depuis le 1 janvier 1970 00h00
    if (diff / 3600000 > 0 || diff / 3600000 == 0) {
      // La durée converti des millisecondes en Heures
      return true;
    } // durée invalide
    else {
      return false;
    } // fin else la durée est invalide
  }

  GetCurrentRole() {
    return atob(localStorage.getItem('id_role_crypted_front'));
  }

  /* -------------------------------------------------------------------------- */
  /*                        pour Migrer une fonction RXJS                       */
  /* -------------------------------------------------------------------------- */
  // .subscribe({
  //   next: (res: any) => {
  //   },
  //   error: () => {
  //    }
  // });
}

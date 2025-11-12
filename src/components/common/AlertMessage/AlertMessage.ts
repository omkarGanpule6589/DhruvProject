import Swal from "sweetalert2";
import "./alert.css"

export function SuccessNotification(message) {
  Swal.fire({
    title: "",
    text: message,
    icon: "success",
    customClass:{
      popup:"success-notification",
      htmlContainer:"abcd",
    },
    confirmButtonText: "Ok",
  });
}
export function SuccessNotificationTransactions(message) {
  Swal.fire({
    toast: true,                      // Enable toast mode
    position: 'top-end',              // Top-right corner
    icon: 'success',
    title: 'Success!',
    text: message,
    showConfirmButton: false,         // No "Ok" button
    timer: 3000,                      // Auto-close in 3 seconds
    timerProgressBar: true,

    customClass: {
      popup: "success-notification",  // Optional custom styling
      htmlContainer: "abcd",
    },

    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}

export function SuccessToastNotificationForFocoVisionOLD(messageLines) {
  Swal.fire({
    icon: 'success',
    title: 'Collected Data',
    html: `
       <div style="color: #000; font-size: 16px;">
        ${messageLines
          .map(line => {
             if (line.startsWith('Collected At:')) {
          return `
            <div style="text-align: center; font-weight: bold; color:rgb(16, 17, 17); margin: 10px 0;">
              ${line}
            </div>`;
        }
            const [label, value] = line.split(':');
            return `
           
                <div style="display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 8px;">
                  <span style="font-weight: bold;">${label?.trim()}</span>
                  <span>${value?.trim()}</span>
                </div>`;
          })
          .join('')}
      </div>
      </div>
    `,
    background: '#ffffff',
    showConfirmButton: true,
    confirmButtonText: 'OK',
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'success-toast-popup',
      icon: 'centered-success-icon'
    },
    didOpen: (popup) => {
      popup.addEventListener('mouseenter', Swal.stopTimer);
      popup.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
}

export function SuccessToastNotificationForFocoVision(messageLines) {
  Swal.fire({
    toast: true,                            // Make it a toast
    position: 'top-end',                    // Top-right corner
    icon: 'success',
    title: 'Collected Data',
    showConfirmButton: false,               // Remove OK button
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    customClass: {
      popup: 'success-toast-popup',         // Optional class for styling
      icon: 'centered-success-icon'
    },
    html: `
      <div style="color: #000; font-size: 15px; max-width: 400px;">
        ${messageLines
          .map(line => {
            if (line.startsWith('Collected At:')) {
              return `
                <div style="text-align: center; font-weight: bold; color: rgb(16, 17, 17); margin: 10px 0;">
                  ${line}
                </div>`;
            }
            const [label, value] = line.split(':');
            return `
              <div style="display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 6px;">
                <span style="font-weight: bold; white-space: nowrap;">${label?.trim()}</span>
                <span style="word-break: break-word;">${value?.trim()}</span>
              </div>`;
          })
          .join('')}
      </div>
    `,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
}


export function ErrorNotification(message) {
  Swal.fire({
    title: "",
    text: message,
    icon: "error",
    customClass:{
      popup:"error-notification",
      htmlContainer:"abcd",
    },
    confirmButtonText: "Ok",
  });
}
export function ErrorNotificationforpasswoeg(message) {
  Swal.fire({
    title: "",
    text: message,
    icon: "error",
    confirmButtonText: "Ok",
    customClass: {
      popup: 'swal-custom-popup'
    }
  });
}


export function SuccessNotificationforInward1(message) {
  // Split the incoming message by "|"
  const messageParts = message.split('|');

  // Extract each part
  const jobCard = messageParts[0];
  const qty = messageParts[1];
  const operator = messageParts[2];
  const txnDate = messageParts[3] + " " + messageParts[4];  // Combine the date and time

  // Construct a formatted message
  // const formattedMessage = `
  //   <strong>Jobcard:</strong> ${jobCard} <br>
  //   <strong>Qty:</strong> ${qty} <br>
  //   <strong>Operator:</strong> ${operator} <br>
  //   <strong>Txn Date:</strong> ${txnDate}
  // `;
//   const formattedMessage = `
//   <div style="text-align: left; font-size: 18px; line-height: 1.8; margin-left: 90px;">
//     <div><strong>Jobcard</strong>  - ${jobCard}</div>
//     <div><strong>Qty</strong>      - ${qty}</div>
//     <div><strong>Operator</strong> - ${operator}</div>
//     <div><strong>Txn Date</strong> - ${txnDate}</div>
//   </div>
// `;
const formattedMessage = `
  <div style="text-align: center; font-size: 18px; line-height: 1.8; margin-left: 90px;">
    <table style="margin: 0 auto; border-spacing: 10px; text-align: left;">
      <tr>
        <td><strong>Jobcard</strong></td>
        <td>-</td>
        <td style="max-width: 250px; word-wrap: break-word; overflow-wrap: break-word;">${jobCard}</td>
      </tr>
      <tr>
        <td><strong>Qty</strong></td>
        <td>-</td>
        <td>${qty}</td>
      </tr>
      <tr>
        <td><strong>Operator</strong></td>
        <td>-</td>
        <td>${operator}</td>
      </tr>
      <tr>
        <td><strong>Txn Date</strong></td>
        <td>-</td>
        <td>${txnDate}</td>
      </tr>
    </table>
  </div>
`;

  // Display the notification using Swal
  Swal.fire({
    title: "Success!",
    html: formattedMessage,
    icon: "success",
      timer: 3000,
    timerProgressBar: true,

     
    customClass: {
       popup: "success-notification",
    //  popup: "success-notification",
      htmlContainer: "abcd",
    },
    confirmButtonText: "Ok",
     didOpen: (popup) => {
      popup.addEventListener('mouseenter', Swal.stopTimer);
      popup.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
}
export function SuccessNotificationforInward(message) {
  const messageParts = message.split('|');

  const jobCard = messageParts[0];
  const qty = messageParts[1];
  const operator = messageParts[2];
  const txnDate = messageParts[3] + " " + messageParts[4];

  const formattedMessage = `
    <div style="font-size: 15px; line-height: 1.5; max-width: 400px;">
      <table style="border-spacing: 8px; text-align: left; width: 100%; word-break: break-word;">
        <tr>
          <td style="white-space: nowrap;"><strong>Jobcard</strong></td>
          <td>-</td>
          <td>${jobCard}</td>
        </tr>
        <tr>
          <td style="white-space: nowrap;"><strong>Qty</strong></td>
          <td>-</td>
          <td>${qty}</td>
        </tr>
        <tr>
          <td style="white-space: nowrap;"><strong>Operator</strong></td>
          <td>-</td>
          <td>${operator}</td>
        </tr>
        <tr>
          <td style="white-space: nowrap;"><strong>Txn Date</strong></td>
          <td>-</td>
          <td>${txnDate}</td>
        </tr>
      </table>
    </div>
  `;

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Success!',
    html: formattedMessage,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'success-notification-toast',
      htmlContainer: 'abcd'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}


// export function SuccessNotificationforMove(message) {
//   // Split the incoming message by "|"
//   const messageParts = message.split('|');

//   // Extract each part
//   const jobCard = messageParts[0];
//   const qty = messageParts[1];
//   const processflow = messageParts[2];
//   const operator = messageParts[3];
//   const txnDate = messageParts[4] + " " + messageParts[5];  // Combine the date and time

//   // Construct a formatted message
//   // const formattedMessage = `
//   //   <strong>Jobcard:</strong> ${jobCard} <br>
//   //   <strong>To Step:</strong> ${qty} <br>
//   //   <strong>Operator:</strong> ${operator} <br>
//   //   <strong>Txn Date:</strong> ${txnDate}
//   // `;
//   // <tr>
//   //       <td><strong>To Step</strong></td>
//   //       <td>-</td>
//   //        <td style="max-width: 100px; word-wrap: break-word; overflow-wrap: break-word;">${processflow}</td>
//   //     </tr>
// const toStepRow = processflow?.trim()
//     ? `
//       <tr>
//         <td><strong>To Step</strong></td>
//         <td>-</td>
//         <td style="max-width: 100px; word-wrap: break-word; overflow-wrap: break-word;">${processflow}</td>
//       </tr>
//     `
//     : '';
//   const formattedMessage = `
//   <div style="text-align: center; font-size: 18px; line-height: 1.8; margin-left: 90px;">
//     <table style="margin: 0 auto; border-spacing: 10px; text-align: left;">
//       <tr>
//         <td><strong>Jobcard</strong></td>
//         <td>-</td>
//          <td style="max-width: 250px; word-wrap: break-word; overflow-wrap: break-word;">${jobCard}</td>
       
//       </tr>
//       <tr>
//         <td><strong>Qty</strong></td>
//         <td>-</td>
//         <td>${qty}</td>
//       </tr>
      
//       <tr>
//         <td><strong>Operator</strong></td>
//         <td>-</td>
//         <td style="max-width: 200px; word-wrap: break-word; overflow-wrap: break-word;">${operator}</td>
       
//       </tr>
//       <tr>
//         <td><strong>Txn Date</strong></td>
//         <td>-</td>
//         <td style="max-width: 200px; word-wrap: break-word; overflow-wrap: break-word;">${txnDate}</td>
     
//       </tr>
//     </table>
//   </div>
// `;


//   // Display the notification using Swal
//   Swal.fire({
//     title: "Success!",
//     html: formattedMessage,
//     icon: "success",
//     customClass: {
//       popup: "success-notification",
//       htmlContainer: "abcd",
//     },
//     confirmButtonText: "Ok",
//   }
// );
// }
export function SuccessNotificationforMoveold(message) {
  // Split the incoming message by "|"
  const messageParts = message.split('|');
 
  // Extract each part
  const jobCard = messageParts[0];
  const qty = messageParts[1];
  const processflow = messageParts[2];
  const operator = messageParts[3];
  const txnDate = messageParts[4] + " " + messageParts[5];  // Combine the date and time
 
  // Construct a formatted message
  // const formattedMessage = `
  //   <strong>Jobcard:</strong> ${jobCard} <br>
  //   <strong>To Step:</strong> ${qty} <br>
  //   <strong>Operator:</strong> ${operator} <br>
  //   <strong>Txn Date:</strong> ${txnDate}
  // `;
 
  // <tr>
      //   <td><strong>To Step</strong></td>
      //   <td>-</td>
      //    <td style="max-width: 100px; word-wrap: break-word; overflow-wrap: break-word;">${processflow}</td>
      // </tr>
const toStepRow = processflow?.trim()
    ? `
      <tr>
        <td><strong>To Step</strong></td>
        <td>-</td>
        <td style="max-width: 100px; word-wrap: break-word; overflow-wrap: break-word;">${processflow}</td>
      </tr>
    `
    : '';
  const formattedMessage = `
  <div style="text-align: center; font-size: 18px; line-height: 1.8; margin-left: 90px;">
    <table style="margin: 0 auto; border-spacing: 10px; text-align: left;">
      <tr>
        <td><strong>Jobcard</strong></td>
        <td>-</td>
         <td style="max-width: 200px; word-wrap: break-word; overflow-wrap: break-word;">${jobCard}</td>
       
      </tr>
      <tr>
        <td><strong>Qty</strong></td>
        <td>-</td>
        <td>${qty}</td>
      </tr>
     
      </tr>
        ${toStepRow}
        <tr>
      <tr>
        <td><strong>Operator</strong></td>
        <td>-</td>
        <td style="max-width: 200px; word-wrap: break-word; overflow-wrap: break-word;">${operator}</td>
       
      </tr>
      <tr>
        <td><strong>Txn Date</strong></td>
        <td>-</td>
        <td style="max-width: 200px; word-wrap: break-word; overflow-wrap: break-word;">${txnDate}</td>
     
      </tr>
    </table>
  </div>
`;
 
 
  // Display the notification using Swal
  Swal.fire({
    title: "Success!",
    html: formattedMessage,
    icon: "success",
    timer: 3000,
    timerProgressBar: true,

  
      
    customClass: {
       popup: "success-notification",
     // popup: "success-notification",
      htmlContainer: "abcd",
      
    },
     didOpen: (popup) => {
      popup.addEventListener('mouseenter', Swal.stopTimer);
      popup.addEventListener('mouseleave', Swal.resumeTimer);
    },
    confirmButtonText: "Ok",
  }
);
}
export function SuccessNotificationforMove(message) {
  const messageParts = message.split('|');

  const jobCard = messageParts[0];
  const qty = messageParts[1];
  const processflow = messageParts[2];
  const operator = messageParts[3];
  const txnDate = messageParts[4] + " " + messageParts[5];

  const toStepRow = processflow?.trim()
    ? `
      <tr>
        <td style="white-space: nowrap;"><strong>To Step</strong></td>
        <td>-</td>
        <td>${processflow}</td>
      </tr>
    `
    : '';

  const formattedMessage = `
    <div style="font-size: 15px; line-height: 1.5; max-width: 400px;">
      <table style="border-spacing: 8px; text-align: left; width: 100%; word-break: break-word;">
        <tr>
          <td style="white-space: nowrap;"><strong>Jobcard</strong></td>
          <td>-</td>
          <td>${jobCard}</td>
        </tr>
        <tr>
          <td style="white-space: nowrap;"><strong>Qty</strong></td>
          <td>-</td>
          <td>${qty}</td>
        </tr>
        ${toStepRow}
        <tr>
          <td style="white-space: nowrap;"><strong>Operator</strong></td>
          <td>-</td>
          <td>${operator}</td>
        </tr>
        <tr>
          <td style="white-space: nowrap;"><strong>Txn Date</strong></td>
          <td>-</td>
          <td>${txnDate}</td>
        </tr>
      </table>
    </div>
  `;

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Success!',
    html: formattedMessage,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'success-notification-toast',
      htmlContainer: 'abcd'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}




export function SuccessNotificationforMoveFirststep1(message) {
  const messageParts = message.split('|');

  const jobCard = messageParts[0];
  const qty = messageParts[1];
  const processflow = messageParts[2];
  const operator = messageParts[3];
  const txnDate = messageParts[4] + " " + messageParts[5];

  const toStepRow = processflow?.trim()
    ? `
      <tr>
        <td><strong>To Step</strong></td>
        <td>-</td>
        <td style="word-wrap: break-word; overflow-wrap: break-word;">${processflow}</td>
      </tr>
    `
    : '';

  const formattedMessage = `
    <div style="font-size: 14px; line-height: 1.6; text-align: center;">
      <table style="margin: 0 auto; border-spacing: 6px; text-align: center;">
        <tr>
          <td><strong>Jobcard</strong></td>
          <td>-</td>
          <td style="word-wrap: break-word;">${jobCard}</td>
        </tr>
        <tr>
          <td><strong>Qty</strong></td>
          <td>-</td>
          <td>${qty}</td>
        </tr>
        ${toStepRow}
        <tr>
          <td><strong>Operator</strong></td>
          <td>-</td>
          <td>${operator}</td>
        </tr>
        <tr>
          <td><strong>Txn Date</strong></td>
          <td>-</td>
          <td>${txnDate}</td>
        </tr>
      </table>
    </div>
  `;

  Swal.fire({
    title: "Success!",
    html: formattedMessage,
    icon: "success",
    showConfirmButton: true,
    confirmButtonText: "Ok",
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      popup: "success-notification",
      htmlContainer: "abcd"
    },
    didOpen: (popup) => {
      popup.addEventListener('mouseenter', Swal.stopTimer);
      popup.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
}
export function SuccessNotificationforMoveFirststep(message) {
  const messageParts = message.split('|');

  const jobCard = messageParts[0];
  const qty = messageParts[1];
  const processflow = messageParts[2];
  const operator = messageParts[3];
  const txnDate = messageParts[4] + " " + messageParts[5];

  const toStepRow = processflow?.trim()
    ? `
      <tr>
        <td style="white-space: nowrap;"><strong>To Step</strong></td>
        <td>-</td>
        <td>${processflow}</td>
      </tr>
    `
    : '';

  const formattedMessage = `
    <div style="font-size: 15px; line-height: 1.5; max-width: 400px;">
      <table style="border-spacing: 8px; text-align: left; width: 100%; word-break: break-word;">
        <tr>
          <td style="white-space: nowrap;"><strong>Jobcard</strong></td>
          <td>-</td>
          <td>${jobCard}</td>
        </tr>
        <tr>
          <td style="white-space: nowrap;"><strong>Qty</strong></td>
          <td>-</td>
          <td>${qty}</td>
        </tr>
        ${toStepRow}
        <tr>
          <td style="white-space: nowrap;"><strong>Operator</strong></td>
          <td>-</td>
          <td>${operator}</td>
        </tr>
        <tr>
          <td style="white-space: nowrap;"><strong>Txn Date</strong></td>
          <td>-</td>
          <td>${txnDate}</td>
        </tr>
      </table>
    </div>
  `;

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Success!',
    html: formattedMessage,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'success-notification-toast',
      htmlContainer: 'abcd'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}

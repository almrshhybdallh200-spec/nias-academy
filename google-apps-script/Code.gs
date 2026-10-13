/**
 * NIAS — حفظ المسجّلين في Google Sheets
 * انسخ هذا الكود داخل: Google Sheet > Extensions > Apps Script
 * ثم: Deploy > New deployment > Web app
 *   - Execute as: Me
 *   - Who has access: Anyone
 * ثم انسخ رابط الـ Web app وضعه في REGISTER_ENDPOINT داخل src/pages/portal.astro
 */

var SHEET_NAME = 'Registrations';

function doPost(e) {
  try {
    var data = {};
    try {
      data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    } catch (_err) {
      data = {};
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'وقت الاستلام',
        'النوع',
        'الصفة',
        'الاسم',
        'الرقم الأكاديمي',
        'الهاتف',
        'الصفحة',
        'وقت العميل',
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      data.type || '',
      data.role || '',
      data.name || '',
      data.pid || '',
      data.phone || '',
      data.page || '',
      data.ts || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// للتحقق السريع من عمل النشر عند فتح الرابط في المتصفح
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'NIAS registration endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}

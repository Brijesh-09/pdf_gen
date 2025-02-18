const fs = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const archiver = require("archiver");
const sendEmail = require("./emailService");
const { File } = require("buffer");

// ... (all existing constant declarations and helper functions remain identical) ...
const stateOrionList = {
    Alabama: "Alabamian",
    Alaska: "Alaskan",
    Arizona: "Arizonian",
    Arkansas: "Arkansan",
    California: "Californian",
    Colorado: "Coloradan, Coloradoan",
    Connecticut: "Connecticuter",
    Delaware: "Delawarean",
    Florida: "Floridian",
    Georgia: "Georgian",
    Hawaii: "Hawaiian",
    Idaho: "Idahoan",
    Illinois: "Illinoisan",
    Indiana: "Indianian",
    Iowa: "Iowan",
    Kansas: "Kansan",
    Kentucky: "Kentuckian",
    Louisiana: "Louisianian",
    Maine: "Mainer",
    Maryland: "Marylander",
    Massachusetts: "Bay Stater",
    Michigan: "Michiganian",
    Minnesota: "Minnesotan",
    Mississippi: "Mississippian",
    Missouri: "Missourian",
    Montana: "Montanan",
    Nebraska: "Nebraskan",
    Nevada: "Nevadian",
    "New Hampshire": "New Hampshirite",
    "New Jersey": "New Jerseyan",
    "New Mexico": "New Mexican",
    "New York": "New Yorker",
    "North Carolina": "North Carolinian",
    "North Dakota": "North Dakotan",
    Ohio: "Ohioan",
    Oklahoma: "Oklahoman",
    Oregon: "Oregonian",
    Pennsylvania: "Pennsylvanian",
    "Rhode Island": "Rhode Islander",
    "South Carolina": "South Carolinian",
    "South Dakota": "South Dakotan",
    Tennessee: "Tennessean",
    Texas: "Texan",
    Utah: "Utahan",
    Vermont: "Vermonter",
    Virginia: "Virginian",
    Washington: "Washingtonian",
    "West Virginia": "West Virginian",
    Wisconsin: "Wisconsinite",
    Wyoming: "Wyomingite"
  };
  
  const OfficeAddress = {
    "Alabama": "Wes Allen<br>Office of the Secretary of State<br>P.O. Box 5616<br>Montgomery, Alabama 36103-5616",
    "Arizona": "Adrian Fontes<br>Office of the Secretary of State<br>1700 W Washington St Fl 7<br>Phoenix AZ 85007-2808",
    "Arkansas": "John Thurston<br>Office of the Secretary of State<br>State Capitol, Suite 256<br>500 Woodlane Street<br>Little Rock, AR 72201",
    "California": "Shirley Weber<br>Office of the Secretary of State<br>1500 11th Street<br>Sacramento, California 95814",
    "Colorado": "Jena Griswold<br>Office of the Secretary of State<br>1700 Broadway, Suite 550<br>Denver CO 80290",
    "Connecticut": "Stephanie Thomas<br>Office of the Secretary of the State<br>P.O. Box 150470<br>165 Capitol Avenue Suite 1000<br>Hartford CT 06115-0470",
    "Delaware": "Jeffrey W. Bullock<br>Office of the Secretary of the State<br>401 Federal St., Suite 3<br>Dover, DE 19901",
    "Florida": "Cord Byrd<br>Office of the Secretary of State<br>R.A. Gray Building<br>500 South Bronough Street<br>Tallahassee, Florida 32399",
    "Georgia": "Brad Raffensperger<br>Office of the Secretary of State<br>214 State Capitol<br>Atlanta, Georgia 30334",
    "Idaho": "Phil McGrane<br>Office of the Secretary of State<br>P.O. Box 83720<br>Boise, ID 83720-0080",
    "Illinois": "Alexi Giannoulias<br>Office of the Secretary of State<br>213 State Capitol<br>Springfield, IL 62756",
    "Indiana": "Diego Morales<br>Office of the Secretary of State<br>200 W. Washington St., Room 201<br>Indianapolis, IN 46204",
    "Iowa": "Paul Pate<br>Office of Secretary of State<br>First Floor, Lucas Building<br>321 E. 12th St.<br>Des Moines, IA 50319",
    "Kansas": "Scott Schwab<br>Office of the Secretary of State<br>Memorial Hall, 1st Floor<br>120 SW 10th Avenue<br>Topeka, KS 66612-1594",
    "Kentucky": "Michael Adams<br>Office of the Secretary of State<br>700 Capital Avenue<br>Suite 152<br>Frankfort, KY 40601",
    "Louisiana": "Nancy Landry<br>Office of the Secretary of State<br>P.O. Box 94125<br>Baton Rouge, LA 70804-9125",
    "Maine": "Shenna Bellows<br>Office of the Secretary of State<br>148 State House Station<br>Augusta, Maine 04333-0148",
    "Maryland": "Susan Lee<br>Office of the Secretary of State<br>16 Francis St.<br>Annapolis, MD 21401",
    "Massachusetts": "William Galvin<br>Secretary of the Commonwealth of Massachusetts<br>1 Ashburton Place<br>Boston, MA 02108",
    "Michigan": "Jocelyn Benson<br>Office of the Secretary of State<br>430 W. Allegan St.<br>Richard H. Austin Building - 4th Floor<br>Lansing, MI 48918",
    "Minnesota": "Steve Simon<br>Office of the Secretary of State<br>First National Bank Building<br>332 Minnesota Street, Suite N201<br>St. Paul, MN 55101",
    "Mississippi": "Michael D. Watson Jr.<br>Office of the Secretary of State<br>125 South Congress St.<br>Suite 100<br>Jackson, MS 39201",
    "Missouri": "Jay Ashcroft<br>Office of the Secretary of State<br>600 West Main Street<br>Jefferson City, Missouri 65101",
    "Montana": "Christi Jacobsen<br>Office of the Secretary of State<br>Montana Capitol Building, Rm 260<br>P.O. Box 202801<br>Helena, MT 59620-2801",
    "Nebraska": "Bob Evnen<br>Office of the Secretary of State<br>P.O. Box 94608<br>Lincoln, NE 68509-4608",
    "Nevada": "Cisco Aguilar<br>Office of the Secretary of State<br>Nevada State Capitol Building<br>101 North Carson Street, Suite 3<br>Carson City, NV 89701",
    "New Hampshire": "David Scanlan<br>Office of the Secretary of State<br>State House, Room 204<br>107 North Main Street<br>Concord, NH 03301-4989",
    "New Jersey": "Tahesha Way<br>Office of the Secretary of State<br>PO BOX 001<br>Trenton, NJ 08625-0001",
    "New Mexico": "Maggie Toulouse Oliver<br>Office of the Secretary of State<br>325 Don Gaspar<br>Suite 300<br>Santa Fe, NM 87501",
    "North Carolina": "Elaine Marshall<br>Office of the Secretary of State<br>State Capitol<br>Raleigh, NC 27601",
    "North Dakota": "Michael Howe<br>Office of the Secretary of State<br>600 E. Boulevard Ave. Dept 108<br>Bismarck, ND 58505",
    "Ohio": "Frank LaRose<br>Office of the Secretary of State<br>180 Civic Center Dr.<br>Columbus, Ohio 43215",
    "Oklahoma": "Josh Cockroft<br>Office of the Secretary of State<br>421 NW 13th Street Ste 210<br>Oklahoma City, OK 73103",
    "Oregon": "LaVonne Griffin-Valade<br>Office of the Secretary of State<br>900 Court Street NE<br>Capitol Room 136<br>Salem OR 97301",
    "Pennsylvania": "Al Schmidt<br>Office of the Secretary of State<br>401 North Street, Rm 302<br>Harrisburg PA 17120",
    "Rhode Island": "Gregg Amore<br>Office of the Secretary of State<br>82 Smith Street<br>State House, Room 218<br>Providence, RI 02903-1120",
    "South Carolina": "Mark Hammond<br>Office of the Secretary of State<br>1205 Pendleton Street, Suite 525<br>Columbia, SC 29201",
    "South Dakota": "Monae Johnson<br>Office of the Secretary of State<br>Capitol Building<br>500 East Capitol Avenue Ste 204<br>Pierre, SD 57501-5070",
    "Tennessee": "Tre Hargett<br>Office of the Secretary of State<br>Capitol Office<br>State Capitol<br>Nashville, TN 37243-1102",
    "Texas": "Jane Nelson<br>Office of the Secretary of State<br>P.O. Box 12887<br>Austin, TX 78711-2887",
    "Vermont": "Sarah Copeland Hanzas<br>Office of the Secretary of State<br>128 State Street<br>Montpelier, VT 05633",
    "Virginia": "Kelly Gee<br>Secretary of the Commonwealth<br>P.O. Box 1475<br>Richmond, VA 23218",
    "Washington": "Steve Hobbs<br>Office of the Secretary of State<br>Legislative Building<br>PO Box 40220<br>Olympia, WA 98504-0220",
    "West Virginia": "Mac Warner<br>Office of the Secretary of State<br>State Capitol Building<br>Charleston, WV 25305",
    "Wisconsin": "Sarah Godlewski<br>Office of the Secretary of State<br>PO Box 7848<br>Madison, WI 53707",
    "Wyoming": "Chuck Gray<br>Office of the Secretary of State<br>Herschler Building East<br>122 West 25th Street<br>Suite 100<br>Cheyenne, WY 82002-0020"
  };

  Handlebars.registerHelper("currentyear", function() {
    const now = new Date();
    return now.getFullYear();
  });
  
  Handlebars.registerHelper("monthname", function(dateString) {
    if (!dateString) return "";
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
  
    return months[date.getMonth()];
  });
  
  
  Handlebars.registerHelper("tenYearsAgo", function() {
    const now = new Date();
    const tenYearsAgo = new Date(now.setFullYear(now.getFullYear() - 10));
  
    const day = tenYearsAgo.getDate();
    
    const formattedDay = day < 10 ? `0${day}` : day;
    const monthName = months[tenYearsAgo.getMonth()];
    const year = tenYearsAgo.getFullYear();
  
    return `${monthName} ${formattedDay}, ${year}`;
  });
  
  Handlebars.registerHelper("currentday", function() {
    const now = new Date();
    const day = now.getDate();
    return day < 10 ? `0${day}` : day;
  });
  
  Handlebars.registerHelper("dateyyyy", function(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
  
    return date.getFullYear();
  });
  
  Handlebars.registerHelper("datedd", function(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = date.getDate();
    return day < 10 ? `0${day}` : day;
  });
  
  Handlebars.registerHelper("timeAmPm", function(dateString) {
    if (!dateString) return "";
  
    const date = new Date(dateString);
  
    let hours = date.getHours();
    const minutes = date.getMinutes();
  
    const amPm = hours >= 12 ? "PM" : "AM";
  
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${hours}:${formattedMinutes} ${amPm}`;
  });
  
  Handlebars.registerHelper("gendersondaughter", function(gender) {
    if (!gender) return "";
    const lowerGender = gender.toLowerCase();
    return lowerGender === "male"
      ? "son"
      : lowerGender === "female" ? "daughter" : "";
  });
  
  Handlebars.registerHelper("uppercase", function(text) {
    if (!text) return "";
    return text.toUpperCase();
  });
  
  Handlebars.registerHelper("firstchar", function(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + ".";
  });
  Handlebars.registerHelper("firstcharno", function(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase();
  });
  
  Handlebars.registerHelper("eq", function(a, b) {
    return a === b;
  });
  Handlebars.registerHelper("eql", function(a, b) {
    if (!a) return false;
    return a.toLowerCase() === (b || "").toLowerCase();
  });
  
  Handlebars.registerHelper("nameList", function(nameList) {
   return addNameGenOncase(nameList) || []
  });
  
  async function generateHtmlContent(templateContent, data) {
    const template = Handlebars.compile(templateContent);
    return template(data);
  }
  
  async function convertHtmlToPdf(browser, htmlContent,footer,header) {
    let page = null;
  
    try {
      if (browser == null || browser.isConnected() === false) {
        browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          timeout: 60000 // Increase timeout if needed
        });
      }
      page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 ...");
  
  
      
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        },
        printBackground: true, 
        scale: 0.98,
        displayHeaderFooter: footer?true:false,
        footerTemplate: footer,
        headerTemplate: header  
      });
      return pdfBuffer;
    } catch (error) {
      console.error("Failed to convert HTML to PDF:", error);
      throw error;
    } finally {
      if (page) {
        await page.close(); // Ensure the page is closed after use
      }
    }
  }
  
  
  
  const capitalize = str =>
    { if(!str) return "" 
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();}
  const uppercase = str => { if(!str) return "" 
    return str.toUpperCase();}
  const firstChar = str => { if(!str) return "" 
    return str.charAt(0).toUpperCase()+"."; }
  const firstCharNo = str => { if(!str) return "" 
    return str.charAt(0).toUpperCase(); }
  
  
  
  /**
   * 
   * @param {Array} names list of name obj   
   * @returns string
   */
  
  function addNameGenOncase(names) {
    const uniqueNames = new Set(); // Use a Set to ensure uniqueness
  
    names.forEach(({ otherFirstName: firstName, otherMiddleName: middleName, otherLastName: lastName }) => {
      // Capitalize each part
      const capFirstName = capitalize(firstName);
      const capMiddleName = capitalize(middleName);
      const capLastName = capitalize(lastName);
  
      // Add name variants to the Set to ensure uniqueness
      uniqueNames.add(`${capFirstName} ${capMiddleName} ${capLastName}`);
      uniqueNames.add(`${capFirstName} ${firstChar(middleName)} ${capLastName}`);
      uniqueNames.add(`${capFirstName} ${capLastName}`);
    });
  
    // Join all the unique name variants with ", " and return
    return uniqueNames;
  }
  /**
   * 
   * @param {Array} names list of name obj   
   * @returns string
   */
  
  function addNameGen(names) {
    const uniqueNames = new Set(); // Use a Set to ensure uniqueness
  
    names.forEach(({ otherFirstName: firstName, otherMiddleName: middleName, otherLastName: lastName }) => {
      // Capitalize each part
      const capFirstName = capitalize(firstName);
      const capMiddleName = capitalize(middleName);
      const capLastName = capitalize(lastName);
  
      // Add name variants to the Set to ensure uniqueness
      uniqueNames.add(`${capFirstName} ${capMiddleName} ${capLastName}`);
      uniqueNames.add(`${capFirstName} ${firstChar(middleName)} ${capLastName}`);
      uniqueNames.add(`${capFirstName} ${capLastName}`);
      uniqueNames.add(`${capLastName}`);
      uniqueNames.add(`${capFirstName} ${capMiddleName}`);
      uniqueNames.add(`${capFirstName} ${capMiddleName} ${uppercase(lastName)}`);
      uniqueNames.add(`${uppercase(firstName)} ${uppercase(middleName)} ${uppercase(lastName)}`);
      uniqueNames.add(`${uppercase(firstName)} ${firstChar(middleName)} ${uppercase(lastName)}`);
      uniqueNames.add(`${uppercase(firstName)} ${uppercase(lastName)}`);
      uniqueNames.add(`${uppercase(lastName)}`);
      uniqueNames.add(`${uppercase(firstName)} ${uppercase(middleName)}`);
    });
  
    // Join all the unique name variants with ", " and return
    return uniqueNames;
  }
  
  
  function addName(names){
    const uniqueNames = addNameGen(names)
    return Array.from(uniqueNames).join(", "); 
  }
  /**
   * convert buffer to zip file
   * @param {File} files file buffoer
   * @returns 
   */
  async function createZip(files) {
    const archive = archiver("zip", { zlib: { level: 1 } });
    const zipBuffer = [];
  
    archive.on("data", chunk => zipBuffer.push(chunk));
  
    return new Promise((resolve, reject) => {
      archive.on("error", reject);
      archive.on("end", () => resolve(Buffer.concat(zipBuffer)));
  
      files.forEach(file => {
        archive.append(file.content, { name: file.name });
      });
  
      archive.finalize();
    });
  }

  
const currentDate = new Date();
const formattedDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}-${currentDate.getFullYear()}`;

// Modified noticeFile handling with theme support
function getNoticeFile(theme) {
  const baseNotice = {
    "./htmlfiles/DC IRS NOTICE - Letter - 09-22-2024nbGWC.html": `DC IRS NOTICE - Letter - ${formattedDate}nbGWC.pdf`,
    "./htmlfiles/SOS NOTICE - Letter - 09-20-2024nb 2 GWC.html": `SOS NOTICE - Letter - ${formattedDate}nb 2 GWC.pdf`,
    "./htmlfiles/SOSOS NOTICE - Letter - 09-22-2024nb GWC.html": `SOSOS NOTICE - Letter - ${formattedDate}nb GWC.pdf`,
  };

  if (theme === 'dark') {
    const darkNotice = {};
    Object.entries(baseNotice).forEach(([key, value]) => {
      const newKey = key.replace(/htmlfiles/g, 'htmlfiles_dark');
      darkNotice[newKey] = value;
    });
    return darkNotice;
  }
  return baseNotice;
}

function fileName(firstName, middleName, lastName, fileName, theme) {
  const uppercase = (str) => str.toUpperCase();
  const firstChar = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase();
  };

  // Update name mappings with theme handling
  const basePath = theme === 'dark' ? './htmlfiles_dark' : './htmlfiles';
  const nameMappings = {
    [`${basePath}/Act of Expatriation and Oath of Allegiance (JOHN MARK DOE).html`]:
      `${uppercase(firstName)} ${uppercase(middleName)} ${uppercase(lastName)}`,
    [`${basePath}/Act of Expatriation and Oath of Allegiance (JOHN M. DOE).html`]:
      `${uppercase(firstName)} ${firstChar(middleName)} ${uppercase(lastName)}`,
    [`${basePath}/Act of Expatriation and Oath of Allegiance (JOHN DOE).html`]:
      `${uppercase(firstName)} ${uppercase(lastName)}`,
  };

  const nameMapping = nameMappings[fileName];

  if (nameMapping) {
    const fileBaseName = path.basename(fileName, ".html");
    return fileBaseName.replace(/(?<=\().+?(?=\))/g, nameMapping) + ".pdf";
  }
  return path.basename(fileName, ".html") + ".pdf";
}

const convertor = async (data, emailAddress, theme = 'light') => {
  const replaceDir = (tempUrl) =>
    theme === 'dark' ? tempUrl.replace(/htmlfiles/g, 'htmlfiles_dark') : tempUrl;

  // Get theme-adjusted notice file
  const noticeFile = getNoticeFile(theme);

  let templates = [
    {
      tempUrl: replaceDir("./htmlfiles/Act of Expatriation and Oath of Allegiance (JOHN DOE).html"),
      header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px; padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Act of Expatriation and Oath of Allegiance – 
              <span style="color: red;">${firstCharNo(data?.firstName)}${firstCharNo(data?.lastName)}</span>
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {
      tempUrl: replaceDir("./htmlfiles/Act of Expatriation and Oath of Allegiance (JOHN M. DOE).html"),
      header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px; padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Act of Expatriation and Oath of Allegiance – 
              <span style="color: red;">${firstCharNo(data?.firstName)}${firstChar(data?.middleName)}${firstCharNo(data?.lastName)}</span>
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {
      tempUrl: replaceDir("./htmlfiles/Act of Expatriation and Oath of Allegiance (JOHN MARK DOE).html"),
      header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px; padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Act of Expatriation and Oath of Allegiance – 
              <span style="color: red;">${firstCharNo(data?.firstName)}${firstCharNo(data?.middleName)}${firstCharNo(data?.lastName)}</span>
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Autograph, Ink Instructions, etc For 928's.html"),header: ()=>"", footer:(data)=>""},
    {
      tempUrl: replaceDir("./htmlfiles/Cancellation of All Prior Powers of Attorney.html"),
      header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Cancellation of All Prior Powers of Attorney
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Certificate of Assumed Name - Notice of Transfer of Reserved Name.html"),
      header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Certificate of Assumed Name - Notice of Transfer of Reserved Name
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Common Carry Declaration.html"), header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Common Carry Declaration
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Cover Sheet (1).html"),header: ()=>"",footer:(data)=>""},
    {tempUrl:replaceDir("./htmlfiles/Declaration of Political Status.html"),header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Declaration of the Naturalization Act of July 1779 (For Americans)
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Declaration of the Naturalization Act of July 1779.html"), header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Declaration of the Naturalization Act of July 1779 (For Americans)
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Fee Schedule - Notice of Intent.html"),header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Fee Schedule, Notice of Intent Template.
            </td>
            <td style="text-align: right;">
              Last Modified: 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Mandatory Notice-Foreign Sovereign Immunity Act (FSIA).html"), header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Mandatory Notice-Foreign Sovereign Immunity Act (FSIA)
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Paramount Claim of the Life and the Estate.html"),header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Paramount Claim of the Life and the Estate.
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/SOSOS NOTICE - Letter - 09-22-2024nb GWC.html"),header: (data)=>`<div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
			<h1 style="text-align: center;font-size:30px">${capitalize(data?.firstName)} ${capitalize(data?.middleName)} ${capitalize(data?.lastName)}©</h1>
			<p style="text-align: center;font-size:18px;font-family: Calibri;margin: 0;">${capitalize(data.address1)}, ${capitalize(data.address2)} </p>
			<p style="text-align: center;font-size:18px;font-family: Calibri;margin: 0;">${capitalize(data.city)}, ${capitalize(data.state)} [${data.zipCode}] </p>
		</div>`,
      footer:(data)=>`<p style="width: 100%; padding: 0 10px; box-sizing: border-box;text-align: center;font-size: 10px;">${capitalize(data?.firstName)} ${capitalize(data?.middleName)} ${capitalize(data?.lastName)}</p></div>`},
    {tempUrl:replaceDir("./htmlfiles/DC IRS NOTICE - Letter - 09-22-2024nbGWC.html"),header: (data)=>`<div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
			<h1 style="text-align: center;font-size:30px">${capitalize(data?.firstName)} ${capitalize(data?.middleName)} ${capitalize(data?.lastName)}©</h1>
			<p style="text-align: center;font-size:18px;font-family: Calibri;margin: 0;">${capitalize(data.address1)}, ${capitalize(data.address2)} </p>
			<p style="text-align: center;font-size:18px;font-family: Calibri;margin: 0;">${capitalize(data.city)}, ${capitalize(data.state)} [${data.zipCode}] </p>
		</div>`,
      footer:(data)=>`<p style="width: 100%; padding: 0 10px; box-sizing: border-box;text-align: center;font-size: 10px;">${capitalize(data?.firstName)} ${capitalize(data?.middleName)} ${capitalize(data?.lastName)}</p></div>`},
    {tempUrl:replaceDir("./htmlfiles/Witness Testimony (1).html"),header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Witness Testimony
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Witness Testimony (2).html"),header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 002 Witness Testimony
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/baby/1779-Declaration-for-American-federal-Employees.html"),header: ()=>"",footer:(data)=>""},
    {tempUrl:replaceDir("./htmlfiles/baby/Baby Deed Cover Letter -IFC.html"),header: ()=>"",footer:(data)=>""},
    {tempUrl:replaceDir("./htmlfiles/baby/Declaration for Naturalized Immigrants.html"),header: ()=>"",footer:(data)=>""},
    {tempUrl:replaceDir("./htmlfiles/baby/Declaration of Green Card Legal Immigrant.html"),header: ()=>"",footer:(data)=>""},
  ];
  

  // ... (rest of template arrays with replaceDir remain identical) ...
  const sosDeed = [{tempUrl:replaceDir("./htmlfiles/SOS NOTICE - Letter - 09-20-2024nb 2 GWC.html"),header: ()=>`<div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
			<h1 style="text-align: center;font-size:30px">${capitalize(data?.firstName)} ${capitalize(data?.middleName)} ${capitalize(data?.lastName)}©</h1>
			<p style="text-align: center;font-size:18px;font-family: Calibri;margin: 0;">${capitalize(data.address1)}, ${capitalize(data.address2)}</p>
			<p style="text-align: center;font-size:18px;font-family: Calibri;margin: 0;">${capitalize(data.city)}, ${capitalize(data.state)} [${data.zipCode}] </p>
		</div>
`,footer:(data)=>`<p style="width: 100%; padding: 0 10px; box-sizing: border-box;text-align: center;font-size: 10px;">${capitalize(data?.firstName)} ${capitalize(data?.middleName)} ${capitalize(data?.lastName)}</p></div>`}];

  const babyDeed = [{tempUrl:replaceDir("./htmlfiles/baby/Baby Deed of Land Recording.html"),header: ()=>"",footer:(data)=>""}];


  const ActFiles = [
    {
      tempUrl: replaceDir("./htmlfiles/Act of Expatriation and Oath of Allegiance (JOHN DOE).html"),
      header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px; padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Act of Expatriation and Oath of Allegiance – 
              <span style="color: red;">${firstCharNo(data?.firstName)}${firstCharNo(data?.lastName)}</span>
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {
      tempUrl: replaceDir("./htmlfiles/Act of Expatriation and Oath of Allegiance (JOHN M. DOE).html"),
      header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px; padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Act of Expatriation and Oath of Allegiance – 
              <span style="color: red;">${firstCharNo(data?.firstName)}${firstChar(data?.middleName)}${firstCharNo(data?.lastName)}</span>
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {
      tempUrl: replaceDir("./htmlfiles/Act of Expatriation and Oath of Allegiance (JOHN MARK DOE).html"),
      header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px; padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Act of Expatriation and Oath of Allegiance – 
              <span style="color: red;">${firstCharNo(data?.firstName)}${firstCharNo(data?.middleName)}${firstCharNo(data?.lastName)}</span>
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },];

  const BornInMilitary = [
    {tempUrl:replaceDir("./htmlfiles/Acknowledgment, Acceptance and Deed of Conveyance Adopted.html"),header: ()=>"",footer: (data) => `
      <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
        <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
          <tr>
            <td style="text-align: left;">
              Form IFC-R 001 Acknowledgment, Acceptance and Deed of Conveyance
            </td>
            <td style="text-align: right;">
              Revised 20240724
            </td>
          </tr>
        </table>
      </div>`
    },
    {tempUrl:replaceDir("./htmlfiles/Acknowledgment, Acceptance and Deed of Conveyance Naturalized.html"),
      header: ()=>"",footer: (data) => `
  <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
    <table style="width: 100%; font-size: 10px;  padding-top: 5px;">
      <tr>
        <td style="text-align: left;">
        Form Form IFC-R 001 Acknowledgment, Acceptance and Deed of Re-Conveyance
        </td>
        <td style="text-align: right;">
          Revised 20240724
        </td>
      </tr>
    </table>
  </div>`}
  ];

  if (data.witness2Relationship == "Other") {
    data.witness1Relationship = data.witness1RelationshipType;
  }
  if (data.witness2Relationship == "Other") {
    data.witness2Relationship = data.witness2RelationshipType;
  }
  // Fixed conditional template addition with theme handling
  if (data.bornCountryStatus == "no") {
    templates = [...templates, ...BornInMilitary];
  } else {
    templates = [
      ...templates,
      {
        tempUrl: replaceDir("./htmlfiles/Acknowledgment, Acceptance and Deed of Re-Conveyance.html"),
        header: () => "",
        footer: (data) => `
        <div style="font-size: 10px; width: 100%; padding: 0 10px; box-sizing: border-box;">
          <table style="width: 100%; font-size: 10px; padding-top: 5px;">
            <tr>
              <td style="text-align: left;">
                Form IFC-R 001 Acknowledgment, Acceptance and Deed of Re-Conveyance
              </td>
              <td style="text-align: right;">
                Revised 20240724
              </td>
            </tr>
          </table>
        </div>`,
      },
    ];
  }

  // ... (remaining code identical to original with proper theme handling) ...

  const conversionPromises = templates.map(async (template) => {
    const templatePath = path.join(__dirname, template.tempUrl);

    // Add error handling for missing templates
    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template not found: ${template.tempUrl}`);
    }

    const templateContent = await fs.readFile(templatePath, "utf8");
    const htmlContent = await generateHtmlContent(templateContent, data);
    const pdfBuffer = await convertHtmlToPdf(
      browser,
      htmlContent,
      template?.footer(data),
      template?.header(data)
    );

    const pdfFilename =
      noticeFile[template.tempUrl] ||
      fileName(data.firstName, data.middleName, data.lastName, template.tempUrl, theme);

    const pdfPath = path.join(localDir, pdfFilename);

    urls.push(path.join(emailPath, pdfFilename));

    // Save the PDF locally
    await fs.writeFile(pdfPath, pdfBuffer);

    return {
      content: pdfBuffer,
      name: path.basename(template.tempUrl, ".html") + ".pdf",
    };
  });

  // ... (remaining code identical to original) ...

  try {
    await fs.ensureDir(localDir);

    if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    if (data.otherNameStatus == "yes") {
      if (data?.maidenNameRedio == "yes") {
        allNames = [
          ...primaryName,
          ...(data?.nameList || []),
          {
            otherFirstName: data.firstName,
            otherMiddleName: data.maidenName,
            otherLastName: data.lastName,
          },
        ];
      } else {
        allNames = [...primaryName, ...(data?.nameList || [])];
      }
    } else if (data?.maidenNameRedio == "yes") {
      allNames = [
        ...primaryName,
        {
          otherFirstName: data.firstName,
          otherMiddleName: data.maidenName,
          otherLastName: data.lastName,
        },
      ];
    }
    data.allNames = allNames;
    data.nameVariations = addName(allNames);

    const pdfBuffers = await Promise.all(conversionPromises);
    const childResults = await Promise.all(childPromises);
    const NameActResults = await Promise.all(NameAct);

    childResults.forEach((result) => {
      result.forEach((pdf) => {
        pdfBuffers.push(pdf); // Add to main PDF buffer list
      });
    });

    NameActResults.forEach((result) => {
      result.forEach((pdf) => {
        pdfBuffers.push(pdf); // Add to main PDF buffer list
      });
    });

    const zipBuffer = await createZip(pdfBuffers);

    const uniqueUrls = [...new Set(urls)];
    return {
      result: true,
      url: uniqueUrls,
      zip: zipBuffer,
    };
  } catch (error) {
    console.log(error);
    return {
      result: false,
    };
  } finally {
    if (browser) {
      await browser.close();
      browser = null; // Ensure the browser is closed after the operation
    }
  }
};

module.exports = convertor;
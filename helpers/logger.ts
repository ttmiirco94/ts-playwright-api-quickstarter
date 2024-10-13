import fs from 'fs';
import path from 'path';

export class Logger {
    private logDir: string;
    private logFile: string;

    constructor(testName: string) {
        this.logDir = path.join('./logs', testName);
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
        this.logFile = path.join(this.logDir, 'log.txt');
    }

    private logToFile(message: string) {
        fs.appendFileSync(this.logFile, `${message}\n`, 'utf8');
    }

    logTestData(testData: any) {
        this.logToFile(`### Test Data ###\n${JSON.stringify(testData, null, 2)}\n`);
    }

    logRequest(requestData: { url: string, method: string, headers: any, body: any }) {
        this.logToFile(`### Request ###\nMethod: ${requestData.method}\nURL: ${requestData.url}\nHeaders: ${JSON.stringify(requestData.headers, null, 2)}\nBody: ${JSON.stringify(requestData.body, null, 2)}\n`);
    }

    logResponse(responseData: { status: number, headers: any, body: any }) {
        this.logToFile(`### Response ###\nStatus: ${responseData.status}\nHeaders: ${JSON.stringify(responseData.headers, null, 2)}\nBody: ${JSON.stringify(responseData.body, null, 2)}\n`);
    }

    logPerformanceData(testExecutionTime: number, responseTime: number) {
        this.logToFile(`### Performance Data ###\nTest Execution Time: ${testExecutionTime} ms\nResponse Time: ${responseTime} ms\n`);
    }

    logCustomData(label: string, data: any) {
        this.logToFile(`### ${label} ###\n${JSON.stringify(data, null, 2)}\n`);
    }

    // New function to generate TypeScript interfaces
    generateInterfaceFromResponse(jsonResponse: any, interfaceName: string, testName: string) {
        const generatedInterface = this.generateTypeScriptInterface(jsonResponse, interfaceName);
        const interfaceFilePath = path.join('./generatedInterfaces', `${testName}.ts`);

        // Ensure the directory exists
        if (!fs.existsSync('./generatedInterfaces')) {
            fs.mkdirSync('./generatedInterfaces', { recursive: true });
        }

        // Check if the interface already exists in the file
        if (fs.existsSync(interfaceFilePath)) {
            const existingContent = fs.readFileSync(interfaceFilePath, 'utf8');
            if (existingContent.includes(`interface ${interfaceName}`)) {
                // If the interface already exists, ignore
                return;
            }
        }

        // Append the generated interface to the file
        fs.appendFileSync(interfaceFilePath, `${generatedInterface}\n`, 'utf8');
    }

    // Utility to generate TypeScript interface
    private generateTypeScriptInterface(json: any, interfaceName: string): string {
        let result = `interface ${interfaceName} {\n`;

        for (const key in json) {
            const value = json[key];

            // Handle array types separately
            let type: string;
            if (Array.isArray(value)) {
                const arrayElementType = this.getTypeOfValue(value[0]); // Get the type of the first element in the array
                type = `${arrayElementType}[]`; // Define as array type
            } else {
                type = this.getTypeOfValue(value); // For non-arrays, get the type normally
            }

            result += `  ${key}: ${type};\n`;
        }

        result += `}\n`;
        return result;
    }

// Utility function to determine the type of a value
    private getTypeOfValue(value: any): string {
        if (value === null) {
            return 'any'; // Handle null values as "any"
        } else if (Array.isArray(value)) {
            return `${this.getTypeOfValue(value[0])}[]`; // Recursively handle arrays
        } else {
            return typeof value; // For primitive types
        }
    }

    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
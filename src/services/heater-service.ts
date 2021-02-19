import csvParser from 'csv-parser';
import fs from 'fs';
import { HeaterAttributes } from '../models/heater-model';
import Service from './service';
import ServiceContainer from './service-container';

/**
 * Heaters service.
 */
export default class HeaterService extends Service {

  /**
   * Creates a new heaters service.
   * 
   * @param container Services container
   */
  public constructor(container: ServiceContainer) {
    super(container);
  }

  /**
   * Import heaters from CSV.
   * 
   * @param path CSV path
   */
  public async import(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.container.log.info(`Starting import "${path}"`);
      const records: CSVRecord[] = [];
      const stream = fs.createReadStream(path).pipe(csvParser({
        separator: ';',
        headers: ['type', 'article', 'width', 'height', 'thickness', 'depth', 'diameter', 'n10', 'n5', 'n2', 'n1'],
        skipLines: 1,
        mapValues: line => {
          const value: string = line.value;
          if (value.length === 0) {
            return null;
          }
          switch (line.header) {
            case 'width':
            case 'height':
            case 'thickness':
            case 'depth':
            case 'diameter':
            case 'n10':
            case 'n5':
            case 'n2':
            case 'n1':
              line.value = parseInt(value.replace(',', '.'));
              break;
            default: break;
          }
          return line.value;
        }
      }));
      stream.on('data', (data: CSVRecord) => records.push(data));
      stream.on('error', reject);
      stream.on('end', () => {
        const models: HeaterAttributes[] = records.map(({ type, article, width, height, thickness, depth, diameter, n10, n5, n2, n1 }) => ({
          type, article, width, height, thickness, depth, diameter, noise: { n10, n5, n2, n1 }
        }));
        this.container.db.heaters.create(models).then(() => {
          this.container.log.info(`Finish import "${path}"`);
          resolve();
        }).catch(reject);
      });
    });
  }
}

/**
 * CSV record interface.
 */
export interface CSVRecord {
  type: string;
  article: string;
  width: number;
  height: number;
  thickness: number;
  depth: number;
  diameter: number;
  n10: number;
  n5: number;
  n2: number;
  n1: number;
}

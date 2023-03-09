import type { ESPLoader } from "../esploader.mjs";
import { ROM } from "./rom.mjs";
import ESP32S3_STUB from "./stub_flasher/stub_flasher_32s3.json";

export class ESP32S3ROM extends ROM {
  CHIP_NAME = "ESP32-S3";
  IMAGE_CHIP_ID = 9;
  EFUSE_BASE = 0x60007000;
  MAC_EFUSE_REG = this.EFUSE_BASE + 0x044;
  UART_CLKDIV_REG = 0x60000014;
  UART_CLKDIV_MASK = 0xfffff;
  UART_DATE_REG_ADDR = 0x60000080;

  FLASH_WRITE_SIZE = 0x400;
  BOOTLOADER_FLASH_OFFSET = 0x0;

  FLASH_SIZES = {
    "1MB": 0x00,
    "2MB": 0x10,
    "4MB": 0x20,
    "8MB": 0x30,
    "16MB": 0x40,
  };

  SPI_REG_BASE = 0x60002000;
  SPI_USR_OFFS = 0x18;
  SPI_USR1_OFFS = 0x1c;
  SPI_USR2_OFFS = 0x20;
  SPI_MOSI_DLEN_OFFS = 0x24;
  SPI_MISO_DLEN_OFFS = 0x28;
  SPI_W0_OFFS = 0x58;

  USB_RAM_BLOCK = 0x800;
  UARTDEV_BUF_NO_USB = 3;
  UARTDEV_BUF_NO = 0x3fcef14c;

  TEXT_START = ESP32S3_STUB.text_start;
  ENTRY = ESP32S3_STUB.entry;
  DATA_START = ESP32S3_STUB.data_start;
  ROM_DATA = ESP32S3_STUB.data;
  ROM_TEXT = ESP32S3_STUB.text;

  async get_chip_description(_loader: ESPLoader) {
    return "ESP32-S3";
  }
  async get_chip_features(_loader: ESPLoader) {
    return ["Wi-Fi", "BLE"];
  }
  async get_crystal_freq(_loader: ESPLoader) {
    return 40;
  }
  _d2h(d: number) {
    const h = (+d).toString(16);
    return h.length === 1 ? "0" + h : h;
  }

  override async _post_connect(loader: ESPLoader) {
    const buf_no = (await loader.read_reg(this.UARTDEV_BUF_NO)) & 0xff;
    loader.debug("In _post_connect " + buf_no);
    if (buf_no == this.UARTDEV_BUF_NO_USB) {
      loader.ESP_RAM_BLOCK = this.USB_RAM_BLOCK;
    }
  }

  async read_mac(loader: ESPLoader) {
    let mac0 = await loader.read_reg(this.MAC_EFUSE_REG);
    mac0 = mac0 >>> 0;
    let mac1 = await loader.read_reg(this.MAC_EFUSE_REG + 4);
    mac1 = (mac1 >>> 0) & 0x0000ffff;
    const mac = new Uint8Array(6);
    mac[0] = (mac1 >> 8) & 0xff;
    mac[1] = mac1 & 0xff;
    mac[2] = (mac0 >> 24) & 0xff;
    mac[3] = (mac0 >> 16) & 0xff;
    mac[4] = (mac0 >> 8) & 0xff;
    mac[5] = mac0 & 0xff;

    return (
      this._d2h(mac[0]) +
      ":" +
      this._d2h(mac[1]) +
      ":" +
      this._d2h(mac[2]) +
      ":" +
      this._d2h(mac[3]) +
      ":" +
      this._d2h(mac[4]) +
      ":" +
      this._d2h(mac[5])
    );
  }

  override get_erase_size(_offset: number, size: number) {
    return size;
  }
}

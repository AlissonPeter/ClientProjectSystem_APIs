export class KindEnum {
  static KIND = new Map([
    [0, "Ativo"],
    [1, "Cancelado"],
    [2, "Fechado"]
  ]);

  static getDescription(id) {
    return this.KIND.get(id) || "Desconhecido";
  }

  static getOptions() {
    return Array.from(this.KIND, ([id, description]) => ({ id, description }));
  }
}
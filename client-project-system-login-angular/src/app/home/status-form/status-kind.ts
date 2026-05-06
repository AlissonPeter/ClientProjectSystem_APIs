export class Kind {
  static KIND = new Map([
    [0, "Ativo"],
    [1, "Cancelado"],
    [2, "Fechado"]
  ]);

  static getDescription(id: number) {
    return this.KIND.get(id) || "Desconhecido";
  }

  static getOptions() {
    return Array.from(this.KIND, ([id, description]) => ({ id, description }));
  }
}
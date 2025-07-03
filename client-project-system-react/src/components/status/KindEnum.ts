export class KindEnum {
  static KIND = new Map<number, string>([
    [0, "Ativo"],
    [1, "Cancelado"],
    [2, "Fechado"]
  ]);

  static getDescription(id: number): string {
    return this.KIND.get(id) || "Desconhecido";
  }

  static getOptions(): { id: number; description: string }[] {
    return Array.from(this.KIND, ([id, description]) => ({ id, description }));
  }
}
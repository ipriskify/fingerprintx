import {
  ICollector,
  CollectorCategory,
  CollectorPriority,
} from "./collector.interface";

export class CollectorRegistry {
  private collectors = new Map<string, ICollector>();
  private static instance: CollectorRegistry;

  static getInstance(): CollectorRegistry {
    if (!CollectorRegistry.instance) {
      CollectorRegistry.instance = new CollectorRegistry();
    }
    return CollectorRegistry.instance;
  }

  register(collector: ICollector): void {
    if (this.collectors.has(collector.metadata.id)) {
      throw new Error(
        `Collector with ID ${collector.metadata.id} is already registered`,
      );
    }
    this.collectors.set(collector.metadata.id, collector);
  }

  unregister(id: string): boolean {
    return this.collectors.delete(id);
  }

  get(id: string): ICollector | undefined {
    return this.collectors.get(id);
  }

  getAll(): ICollector[] {
    return Array.from(this.collectors.values());
  }

  getByCategory(category: CollectorCategory): ICollector[] {
    return this.getAll().filter(
      (collector) => collector.metadata.category === category,
    );
  }

  getByPriority(priority: CollectorPriority): ICollector[] {
    return this.getAll().filter(
      (collector) => collector.metadata.priority === priority,
    );
  }

  getSorted(): ICollector[] {
    return this.getAll().sort((a, b) => {
      const priorityDiff = a.metadata.priority - b.metadata.priority;
      if (priorityDiff !== 0) return priorityDiff;

      return a.metadata.category.localeCompare(b.metadata.category);
    });
  }

  getSupported(): ICollector[] {
    return this.getAll().filter((collector) => collector.isSupported());
  }

  clear(): void {
    this.collectors.clear();
  }

  has(id: string): boolean {
    return this.collectors.has(id);
  }

  size(): number {
    return this.collectors.size;
  }
}

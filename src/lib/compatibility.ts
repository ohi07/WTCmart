/**
 * WTCmart PC Builder Hardware Compatibility Engine
 * Validates electrical, physical, and architectural compatibility between computer hardware components.
 */

import { CompatibilityReport, PCBuildComponent, Product } from '../types';

export function evaluatePCBuildCompatibility(components: Record<string, Product | undefined>): CompatibilityReport {
  const issues: string[] = [];
  const warnings: string[] = [];

  const cpu = components['cpu'];
  const motherboard = components['motherboard'];
  const ram = components['ram'];
  const gpu = components['gpu'];
  const storage = components['storage'];
  const psu = components['psu'];
  const cooler = components['cooler'];
  const casing = components['casing'];
  const monitor = components['monitor'];

  // 1. Calculate Estimated Power Draw (Watts)
  let totalWattage = 50; // Base motherboard, chipset, fans, SSD power baseline

  if (cpu?.specifications.wattage || cpu?.specifications.tdp) {
    totalWattage += (cpu.specifications.wattage || cpu.specifications.tdp || 65);
  }
  if (gpu?.specifications.wattage || gpu?.specifications.tdp) {
    totalWattage += (gpu.specifications.wattage || gpu.specifications.tdp || 120);
  }
  if (motherboard?.specifications.wattage) {
    totalWattage += motherboard.specifications.wattage;
  }
  if (ram?.specifications.wattage) {
    totalWattage += ram.specifications.wattage;
  }
  if (storage?.specifications.wattage) {
    totalWattage += storage.specifications.wattage;
  }
  if (cooler?.specifications.wattage) {
    totalWattage += cooler.specifications.wattage;
  }

  // Recommended PSU = Total Wattage + 20% safety headroom for transient spikes, rounded to nearest 50W
  const rawRecommended = totalWattage * 1.25;
  const recommendedPsuWattage = Math.ceil(rawRecommended / 50) * 50;

  // 2. CPU & Motherboard Socket Check
  if (cpu && motherboard) {
    const cpuSocket = cpu.specifications.socket?.toUpperCase();
    const mbSocket = motherboard.specifications.socket?.toUpperCase();

    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      issues.push(
        `Socket Incompatibility: ${cpu.name} uses socket [${cpuSocket}], but ${motherboard.name} has socket [${mbSocket}]. They cannot physically connect.`
      );
    }
  }

  // 3. Motherboard & RAM Generation Check (DDR4 vs DDR5)
  if (motherboard && ram) {
    const mbRamType = motherboard.specifications.ramType?.toUpperCase();
    const ramType = ram.specifications.ramType?.toUpperCase();

    if (mbRamType && ramType && mbRamType !== ramType) {
      issues.push(
        `RAM Architecture Mismatch: ${motherboard.name} requires [${mbRamType}], but selected RAM is [${ramType}]. RAM slots are not backwards compatible.`
      );
    }
  }

  // 4. GPU Physical Length vs Casing Clearance Check
  if (gpu && casing) {
    const gpuLength = gpu.specifications.gpuLengthMm;
    const maxCaseGpuLength = casing.specifications.maxGpuLengthSupportedMm;

    if (gpuLength && maxCaseGpuLength && gpuLength > maxCaseGpuLength) {
      issues.push(
        `Physical Clearance Issue: ${gpu.name} is ${gpuLength}mm long, but ${casing.name} only supports graphics cards up to ${maxCaseGpuLength}mm.`
      );
    } else if (gpuLength && maxCaseGpuLength && maxCaseGpuLength - gpuLength < 15) {
      warnings.push(
        `Tight Fit Warning: ${gpu.name} leaves only ${maxCaseGpuLength - gpuLength}mm clearance inside ${casing.name}. Cable management may require extra care.`
      );
    }
  }

  // 5. CPU Cooler Height vs Casing Clearance
  if (cooler && casing) {
    const coolerHeight = cooler.specifications.coolerHeightMm;
    const maxCoolerHeight = casing.specifications.maxCoolerHeightSupportedMm;

    if (coolerHeight && maxCoolerHeight && coolerHeight > maxCoolerHeight) {
      issues.push(
        `Cooler Height Conflict: ${cooler.name} height (${coolerHeight}mm) exceeds ${casing.name}'s max side panel clearance of ${maxCoolerHeight}mm.`
      );
    }
  }

  // 6. Power Supply Wattage Sufficiency
  if (psu) {
    const psuCapacity = psu.specifications.wattage;
    if (psuCapacity && psuCapacity < totalWattage) {
      issues.push(
        `Insufficient Power Supply: System estimated draw is ${totalWattage}W, but ${psu.name} only provides ${psuCapacity}W. Your system may shut down under load.`
      );
    } else if (psuCapacity && psuCapacity < recommendedPsuWattage) {
      warnings.push(
        `Marginal Power Headroom: Selected PSU (${psuCapacity}W) is slightly below recommended ${recommendedPsuWattage}W for peak GPU boost spikes.`
      );
    }
  }

  // 7. Calculate Total Build Price
  let totalPrice = 0;
  Object.values(components).forEach(item => {
    if (item) {
      totalPrice += item.salePrice || item.regularPrice;
    }
  });

  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
    totalWattage,
    recommendedPsuWattage,
    totalPrice
  };
}
